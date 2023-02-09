"use client";
import { makeMonths } from "@/lib/calendar";
import {
  eachDayOfInterval,
  endOfMonth,
  isWithinInterval,
  startOfMonth,
} from "date-fns";
import { useMemo } from "react";
import {
  CalendarItem,
  CalendarSimpleProps,
  DayAndEvent,
  Month,
} from "../types";
import CalendarMonth from "./CalendarMonth";
import HoverProvider from "./HoverProvider";
import SimpleCalendarProvider from "./SimpleCalendarProvider";

const week = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const minCellHeight = 5;

export default function CalendarSimple<T extends CalendarItem>({
  time: { start, monthLength },
  events,
  eventProps,
  dayProps,
  style,
  zoom,
}: CalendarSimpleProps<T>) {
  const months = useMemo(
    () => makeMonths(start, monthLength),
    [start, monthLength]
  );

  const daysAndEventsOf = ({ day }: Month) =>
    mergeDaysAndEvent<T>(
      eachDayOfInterval({
        start: startOfMonth(day),
        end: endOfMonth(day),
      }),
      events
    );

  return (
    <div
      className={`grid grid-cols-7 ${style?.className}`}
      style={{ width: `${50 + zoom * 10}%`, ...style?.props }}
    >
      <Week />
      <SimpleCalendarProvider
        cellHeight={`${minCellHeight + zoom * 0.5}em`}
        event={eventProps}
        day={dayProps}
      >
        <HoverProvider elements={events.map((m) => m.id)}>
          {months.map((m, id) => (
            <CalendarMonth
              key={id}
              days={daysAndEventsOf(m)}
              isFirstMonth={id == 0}
            />
          ))}
        </HoverProvider>
      </SimpleCalendarProvider>
    </div>
  );
}

function Week() {
  return (
    <>
      {week.map((d, id) => (
        <Day day={d} key={id} />
      ))}
    </>
  );
}

const Day = ({ day }: { day: string }) => (
  <div className="bg-white border-l-2 border-blue-900 sticky top-0 p-4">
    {day}
  </div>
);

function mergeDaysAndEvent<T extends CalendarItem>(
  days: Date[],
  events: T[]
): DayAndEvent<T>[] {
  function eventOf(d: Date) {
    for (let evt of events) {
      let { start, end } = evt;
      if (isWithinInterval(d, { start, end })) return evt;
    }
  }

  return days.map((d) => {
    return { date: d, event: eventOf(d), span: 1 };
  });
}
