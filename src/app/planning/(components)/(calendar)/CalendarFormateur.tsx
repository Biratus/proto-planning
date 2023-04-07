import { checkOverlapModules, toCalendarData } from "@/lib/calendar/calendar";
import { getTargetDay } from "@/lib/mouseEvent";
import { mergeStyle } from "@/lib/style";
import { Formateur, FormateurWithModule, ModuleEvent } from "@/lib/types";
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
import { FormateurView } from "./CalendarView";
type CalendarFormateurProps = {
  formateurs: FormateurWithModule[];
  dataRefresh: () => void;
};
export default function CalendarFormateur<
  E extends CalendarEventComponent<ModuleEvent>
>({
  formateurs,
  dataRefresh,
  day,
  ...props
}: CalendarFormateurProps & CommonCalendarProps<ModuleEvent, E>) {
  const calendarData = useMemo(() => {
    let data = toCalendarData<FormateurWithModule>(
      formateurs,
      "formateur.mail",
      FormateurView
    );
    checkOverlapModules(data);
    return data;
  }, [formateurs]);

  const {
    dropTarget,
    draggedModule,
    setDropTarget,
    isDropTarget,
    cleanDropTarget,
  } = useDropTarget();

  const changeDropTarget = useCallback(
    (
      dayAndEvent: DayAndEvent<ModuleEvent>,
      formateur: Formateur,
      evt: DragEvent<HTMLElement>
    ) => {
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
      if (
        !dropTarget ||
        !isSameDay(targetDay, dropTarget!.interval.start) ||
        dropTarget.row != formateur
      ) {
        setDropTarget(
          {
            start: targetDay,
            end: addDays(targetDay, draggedModule!.duration - 1),
          },
          formateur
        );
      }
    },
    [draggedModule, dropTarget, props.time]
  );
  const dropModule = () => console.log("TODO dropModule");
  // const dropModule = useCallback(() => {
  //   setModules((prevModules) => {
  //     const newModules = prevModules.filter((m) => m.id != draggedModule!.id);
  //     newModules.push({
  //       ...draggedModule!,
  //       start: formatISO(dropTarget!.interval.start),
  //       end: formatISO(dropTarget!.interval.end),
  //       formateur: dropTarget!.row as Formateur,
  //     });
  //     return newModules;
  //   });
  //   cleanDropTarget();
  // }, [modules, dropTarget, draggedModule]);

  return (
    <>
      <FullCalendar
        {...props}
        data={calendarData}
        LabelComponent={FormateurView.LabelComponent}
        day={{
          ...day,
          styleProps: (date) => {
            let style = day.styleProps(date);
            if (isDropTarget(date)) style = mergeStyle(style, dropTargetStyle);
            return style;
          },
        }}
        drag={{
          drag: (dayAndEvent, formateur, evt) => {
            if (!dayAndEvent.event!.overlap)
              setDraggedModule(dayAndEvent.event!);
            else evt.preventDefault();
          },
          enter: (dayAndEvent, formateur, evt) => {
            changeDropTarget(dayAndEvent, formateur, evt);
          },
          leave: (dayAndEvent, formateur, evt) => {},
          drop: (dayAndEvent, formateur, evt) => {
            dropModule();
          },
          move: (dayAndEvent, formateur, evt) => {
            evt.preventDefault();
            changeDropTarget(dayAndEvent, formateur, evt);
          },
        }}
      />
    </>
  );
}
