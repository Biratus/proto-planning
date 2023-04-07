// "use client";
import { checkOverlapModules, toCalendarData } from "@/lib/calendar/calendar";
import { getTargetDay } from "@/lib/mouseEvent";
import { mergeStyle } from "@/lib/style";
import { Filiere, Module, ModuleEvent } from "@/lib/types";
import FullCalendar from "@/packages/calendar/fullCalendar/FullCalendar";
import {
  CalendarEvent,
  CalendarEventComponent,
  CommonCalendarProps,
  DayAndEvent,
} from "@/packages/calendar/types";
import { addDays, isSameDay } from "date-fns";
import { DragEvent, useCallback, useMemo } from "react";
import { setDraggedModule, useDropTarget } from "./CalendarProvider";
import { dropTargetStyle } from "./CalendarStyle";
import { FiliereView } from "./CalendarView";
type CalendarFiliereProps = {
  filieres: Filiere[];
  dataRefresh: () => void;
};
export default function CalendarFiliere<
  E extends CalendarEventComponent<ModuleEvent>
>({
  filieres,
  dataRefresh,
  day,
  ...props
}: CalendarFiliereProps & CommonCalendarProps<ModuleEvent, E>) {
  const calendarData = useMemo(() => {
    // console.log("make calendarData");
    filieres.forEach((f) => (f.modules = f.modules || []));
    const data = toCalendarData<Filiere & { modules: Module[] }>(
      filieres as (Filiere & { modules: Module[] })[],
      "filiere",
      FiliereView
    );
    checkOverlapModules(data);
    return data;
  }, [filieres]);
  // console.log({ filieres });
  const {
    dropTarget,
    draggedModule,
    setDropTarget,
    isDropTarget,
    cleanDropTarget,
  } = useDropTarget();

  const changeDropTarget = useCallback(
    (dayAndEvent: DayAndEvent<ModuleEvent>, evt: DragEvent<HTMLElement>) => {
      let targetDay;
      if (!dayAndEvent.event || dayAndEvent.event.duration == 1) {
        // Simple day or single day event
        targetDay = dayAndEvent.date;
      } else {
        // Day with event accross multiple days
        // Calculate on which day it was droped
        let rect = evt.currentTarget.getBoundingClientRect();
        targetDay = getTargetDay(
          dayAndEvent as CalendarEvent<ModuleEvent>,
          {
            targetWidth: evt.currentTarget.clientWidth,
            mouseOffsetX: evt.clientX - rect.x,
          },
          props.time
        );
      }
      if (!dropTarget || !isSameDay(targetDay, dropTarget.interval.start)) {
        setDropTarget({
          start: targetDay,
          end: addDays(targetDay, draggedModule!.duration - 1),
        });
      }
    },
    [draggedModule, dropTarget, props.time]
  );

  const dropModule = useCallback(() => {
    // filieres.find(f => f.nom==draggedModule?.filiere.nom)?.modules.find(m => m.id == draggedModule!.id);

    const targetModule = filieres
      .find((f) => f.nom == draggedModule?.filiere!.nom)!
      .modules!.find((m) => m.id == draggedModule!.id);
    targetModule!.start = dropTarget!.interval.start;
    targetModule!.end = dropTarget!.interval.end;
    // setModules((prevModules) => {
    //   const newModules = prevModules.filter((m) => m.id != draggedModule!.id);
    //   newModules.push({
    //     ...draggedModule!,
    //     start: formatISO(dropTarget!.interval.start),
    //     end: formatISO(dropTarget!.interval.end),
    //   });
    //   return newModules;
    // });
    dataRefresh();
    cleanDropTarget();
  }, [draggedModule, dropTarget]);

  return (
    <FullCalendar
      {...props}
      data={calendarData}
      LabelComponent={FiliereView.LabelComponent}
      day={{
        ...day,
        styleProps: (date) => {
          let style = day.styleProps(date);
          if (isDropTarget(date)) style = mergeStyle(style, dropTargetStyle);
          return style;
        },
      }}
      drag={{
        drag: (dayAndEvent, row, evt) => {
          if (!dayAndEvent.event!.overlap) setDraggedModule(dayAndEvent.event!);
          else evt.preventDefault();
        },
        enter: (dayAndEvent, row, evt) => {
          if (draggedModule!.filiere!.nom !== row.nom) {
            cleanDropTarget();
            return;
          }
          changeDropTarget(dayAndEvent, evt);
        },
        leave: (_, row, __) => {
          if (draggedModule!.filiere!.nom !== row.nom) cleanDropTarget();
        },
        drop: (_, row, __) => {
          if (draggedModule!.filiere!.nom !== row.nom) {
            cleanDropTarget();
            return;
          }
          dropModule();
        },
        move: (dayAndEvent, row, evt) => {
          evt.preventDefault();
          if (draggedModule!.filiere!.nom !== row.nom) {
            cleanDropTarget();
            return;
          }
          changeDropTarget(dayAndEvent, evt);
        },
      }}
    />
  );
}
