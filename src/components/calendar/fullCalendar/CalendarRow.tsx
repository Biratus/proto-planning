"use client";

import { eachDayOfInterval, isWithinInterval } from "date-fns";
import { DragEvent } from "react";
import {
  CalendarEvent as CalendarEventType,
  CalendarItem,
  CalendarRowProps,
  DayAndEvent,
} from "../types";
import CalendarEvent from "./CalendarEvent";
import { useFullCalendarRow } from "./FullCalendarProvider";

export default function CalendarRow<K, T extends CalendarItem>({
  events,
  labelProps: { key: labelKey, title: labelTitle, LabelComponent },
}: CalendarRowProps<K, T>) {
  const {
    days,
    dayStyle,
    drag: { enter, leave, move, drop, drag },
  } = useFullCalendarRow<K, T>();

  const daysAndEvents = mergeDaysAndEvent(
    days!,
    events,
    days![days!.length - 1]
  );

  return (
    <>
      <div
        className={`tooltip tooltip-right sticky self-auto left-0 z-10`}
        data-tip={labelTitle}
      >
        <LabelComponent labelKey={labelKey} />
      </div>
      {daysAndEvents.map((day, id) => {
        const dragEvents = {
          onDrag: (evt: DragEvent<HTMLElement>) =>
            drag(day as CalendarEventType<T>, labelKey, evt),
          onDragOver: (evt: DragEvent<HTMLElement>) => move(day, labelKey, evt),
          onDragEnter: (evt: DragEvent<HTMLElement>) =>
            enter(day, labelKey, evt),
          onDragLeave: (evt: DragEvent<HTMLElement>) =>
            leave(day, labelKey, evt),
          onDrop: (evt: DragEvent<HTMLElement>) => drop(day, labelKey, evt),
        };
        return day.event ? (
          <CalendarEvent
            key={id}
            day={day as CalendarEventType<T>}
            {...dragEvents}
          />
        ) : (
          <div
            key={id}
            className={`text-center ${dayStyle!(day.date).className}`}
            style={dayStyle!(day.date).props}
            {...dragEvents}
          ></div>
        );
      })}
    </>
  );
}

function mergeDaysAndEvent<T extends CalendarItem>(
  days: Date[],
  events: T[],
  limit: Date
): DayAndEvent<T>[] {
  function eventOf(d: Date) {
    for (let evt of events) {
      let { start, end } = evt;
      if (isWithinInterval(d, { start, end })) return evt;
    }
  }

  let newDays = [];
  let currSkip = 0;

  for (let d of days) {
    if (currSkip > 0) {
      currSkip--;
      continue;
    }

    let evt = eventOf(d);
    if (evt) {
      // Make cell span for duration of event if within time interval
      let span =
        evt.end.getTime() > limit.getTime()
          ? eachDayOfInterval({
              start: evt.start,
              end: limit,
            }).length
          : evt.duration;
      currSkip = span - 1;
      newDays.push({ date: d, event: evt, span });
    } else newDays.push({ date: d, span: 1 });
  }
  return newDays;
}
