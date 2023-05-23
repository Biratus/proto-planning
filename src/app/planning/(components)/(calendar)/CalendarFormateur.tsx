import { checkOverlapModules, toCalendarData } from "@/lib/calendar/calendar";
import { getTargetDay } from "@/lib/mouseEvent";
import { mergeStyle } from "@/lib/style";
import {
  Formateur,
  FormateurWithModule,
  Module,
  ModuleEvent,
} from "@/lib/types";
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
import { FormateurView } from "./CalendarView";
type CalendarFormateurProps = {
  modules: Module[];
  updateModules: (modules: Module[]) => void;
};
export default function CalendarFormateur({
  modules,
  updateModules,
  dayStyle,
  ...props
}: { dayStyle: (day: Date) => Style } & CalendarFormateurProps &
  CommonCalendarProps<ModuleEvent>) {
  const calendarData = useMemo(() => {
    let data = toCalendarData<FormateurWithModule>(
      modules,
      "formateur.mail",
      FormateurView
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
  } = useDropTarget<Formateur>();

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
          props.timeSpan
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
    [draggedModule, dropTarget, props.timeSpan, setDropTarget]
  );
  const dropModule = useCallback(() => {
    updateModules([
      {
        ...draggedModule!,
        start: dropTarget!.interval.start,
        end: dropTarget!.interval.end,
        formateur: dropTarget!.row,
      },
    ]);
    cleanDropTarget();
    // dataRefresh();
    // cleanDropTarget();
  }, [dropTarget, draggedModule, cleanDropTarget, updateModules]);

  return (
    <>
      <FullCalendar
        {...props}
        data={calendarData}
        LabelComponent={FormateurView.LabelComponent}
        dayStyle={(date, row) => {
          let style = dayStyle(date);
          if (
            isDropTarget(date) &&
            (!row || (row && row.mail == dropTarget?.row.mail))
          )
            style = mergeStyle(style, dropTargetStyle);
          return style;
        }}
        drag={{
          drag: (dayAndEvent, _, evt) => {
            if (!dayAndEvent.event!.overlap)
              setDraggedModule(dayAndEvent.event!);
            else evt.preventDefault();
          },
          enter: (dayAndEvent, formateur, evt) => {
            changeDropTarget(dayAndEvent, formateur, evt);
          },
          leave: () => {},
          drop: () => {
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
