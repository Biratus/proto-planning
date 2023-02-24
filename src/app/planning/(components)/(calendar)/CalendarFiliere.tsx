"use client";
import { checkOverlapModules, toCalendarData } from "@/lib/calendar";
import { getTargetDay } from "@/lib/mouseEvent";
import { mergeStyle } from "@/lib/style";
import { ModuleEvent, RawModule } from "@/lib/types";
import FullCalendar from "@/packages/calendar/fullCalendar/FullCalendar";
import {
  CalendarEvent,
  CommonCalendarProps,
  DayAndEvent,
} from "@/packages/calendar/types";
import { addDays, formatISO, isSameDay } from "date-fns";
import { DragEvent, ElementType, useCallback, useMemo, useState } from "react";
import { setDraggedModule, useDropTarget } from "./CalendarProvider";
import { dropTargetStyle } from "./CalendarStyle";
import { FiliereView } from "./CalendarView";

export default function CalendarFiliere<E extends ElementType>({
  modules: originalModules,
  day,
  ...props
}: { modules: RawModule[] } & CommonCalendarProps<ModuleEvent, E>) {
  const [modules, setModules] = useState(originalModules);
  const calendarData = useMemo(() => {
    const data = toCalendarData(modules, "filiere", FiliereView);
    checkOverlapModules(data);
    return data;
  }, [modules]);

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
    setModules((prevModules) => {
      const newModules = prevModules.filter((m) => m.id != draggedModule!.id);
      newModules.push({
        ...draggedModule!,
        start: formatISO(dropTarget!.interval.start),
        end: formatISO(dropTarget!.interval.end),
      });
      return newModules;
    });
    cleanDropTarget();
  }, [draggedModule, modules, dropTarget]);

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
          if (draggedModule!.filiere !== row) {
            cleanDropTarget();
            return;
          }
          changeDropTarget(dayAndEvent, evt);
        },
        leave: (_, row, __) => {
          if (draggedModule!.filiere !== row) cleanDropTarget();
        },
        drop: (_, row, __) => {
          if (draggedModule!.filiere !== row) {
            cleanDropTarget();
            return;
          }
          dropModule();
        },
        move: (dayAndEvent, row, evt) => {
          evt.preventDefault();
          if (draggedModule!.filiere !== row) {
            cleanDropTarget();
            return;
          }
          changeDropTarget(dayAndEvent, evt);
        },
      }}
    />
  );
}
