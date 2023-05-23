// "use client";
import { checkOverlapModules, toCalendarData } from "@/lib/calendar/calendar";
import { getTargetDay } from "@/lib/mouseEvent";
import { mergeStyle } from "@/lib/style";
import { Filiere, Module, ModuleEvent } from "@/lib/types";
import FullCalendar from "@/packages/calendar/fullCalendar/FullCalendar";
import {
  CalendarEvent,
  CommonCalendarProps,
  DayAndEvent,
  Style,
} from "@/packages/calendar/types";
import { addDays, isSameDay } from "date-fns";
import { DragEvent, useCallback, useMemo } from "react";
import { setDraggedModule, useDropTarget } from "./CalendarProvider";
import { dropTargetStyle } from "./CalendarStyle";
import { FiliereView } from "./CalendarView";
type CalendarFiliereProps = {
  modules: Module[];
  updateModules: (modules: Module[]) => void;
  // dataRefresh: () => void;
};
export default function CalendarFiliere({
  modules,
  updateModules,
  dayStyle,
  ...props
}: { dayStyle: (day: Date) => Style } & CalendarFiliereProps &
  CommonCalendarProps<ModuleEvent>) {
  const calendarData = useMemo(() => {
    const data = toCalendarData<Filiere & { modules: Module[] }>(
      modules,
      "filiere.nom",
      FiliereView
    );
    checkOverlapModules(data);
    return data;
  }, [modules]);

  const {
    dropTarget,
    draggedModule,
    setDropTarget,
    isDropTarget,
    cleanDropTarget,
  } = useDropTarget<Filiere>();

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
          props.timeSpan
        );
      }
      if (!dropTarget || !isSameDay(targetDay, dropTarget.interval.start)) {
        setDropTarget(
          {
            start: targetDay,
            end: addDays(targetDay, draggedModule!.duration - 1),
          },
          draggedModule?.filiere
        );
      }
    },
    [draggedModule, dropTarget, props.timeSpan, setDropTarget]
  );

  const dropModule = useCallback(() => {
    updateModules([
      {
        ...draggedModule!,
        start: dropTarget!.interval.start,
        end: dropTarget!.interval.end,
      },
    ]);
    cleanDropTarget();
  }, [draggedModule, dropTarget, cleanDropTarget, updateModules]);

  return (
    <FullCalendar
      {...props}
      data={calendarData}
      LabelComponent={FiliereView.LabelComponent}
      dayStyle={(date, row) => {
        let style = dayStyle(date);
        if (
          isDropTarget(date) &&
          (!row || (row && row.nom == dropTarget?.row.nom))
        )
          style = mergeStyle(style, dropTargetStyle);
        return style;
      }}
      drag={{
        drag: (dayAndEvent, _, evt) => {
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
