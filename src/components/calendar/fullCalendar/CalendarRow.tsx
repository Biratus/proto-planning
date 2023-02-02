"use client";

import { eachDayOfInterval, isWithinInterval } from "date-fns";
import { Context, useContext } from "react";
import {
  CalendarEvent as CalendarEventType,
  CalendarRowProps,
  FullCalendarContext,
  IntervalWithDuration,
} from "../types";
import CalendarEvent from "./CalendarEvent";

export default function CalendarRow<K, T extends IntervalWithDuration>({
  events,
  labelProps: { key: labelKey, title: labelTitle, LabelComponent },
  EventTooltip,
  ctx,
}: CalendarRowProps<K, T> & { ctx: Context<FullCalendarContext<T>> }) {
  const {
    days,
    commonDayStyle,
    // drag: { enter, leave, move, drop, drag },
  } = useContext(ctx);

  const daysAndEvents = mergeDaysAndEvent(
    days!,
    events,
    days![days!.length - 1]
  );

  return (
    <>
      <div className={`tooltip tooltip-right`} data-tip={labelTitle}>
        <LabelComponent labelKey={labelKey} />
      </div>
      {daysAndEvents.map((day, id) => {
        // const dragEvents = {
        //   onDrag: (evt) => drag(day, labelKey, evt),
        //   onDragOver: (evt) => move(day, labelKey, evt),
        //   onDragEnter: (evt) => enter(day, labelKey, evt),
        //   onDragLeave: (evt) => leave(day, labelKey, evt),
        //   onDrop: (evt) => drop(day, labelKey, evt),
        // };
        return "event" in day ? (
          <CalendarEvent key={id} day={day} ctx={ctx} />
        ) : (
          <div
            key={id}
            className={`text-center ${commonDayStyle!(day.date).className}`}
            style={commonDayStyle!(day.date).props}
          ></div>
        );
      })}
    </>
  );
}

function mergeDaysAndEvent<T extends IntervalWithDuration>(
  days: Date[],
  events: T[],
  limit: Date
): (CalendarEventType<T> | { date: Date })[] {
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
    } else newDays.push({ date: d });
  }
  return newDays;
}
