"use client";
import {
  eachDayOfInterval,
  endOfMonth,
  isWithinInterval,
  startOfMonth,
} from "date-fns";
import { useMemo } from "react";
import {
  CalendarEventComponent,
  CalendarItem,
  CalendarSimpleProps,
  DayAndEvent,
  Month,
} from "../types";
import { makeMonths } from "../utils";
import CalendarMonth from "./CalendarMonth";
import HoverProvider from "./HoverProvider";
import SimpleCalendarProvider from "./SimpleCalendarProvider";

const week = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const minCellHeight = 5;

export default function CalendarSimple<
  T extends CalendarItem,
  E extends CalendarEventComponent<T>
>({
  timeSpan,
  events,
  eventProps,
  dayProps,
  style,
  monthLabelStyle = { className: "" },
  zoom,
}: CalendarSimpleProps<T, E>) {
  const months = useMemo(
    () => makeMonths(timeSpan.start, timeSpan.end),
    [timeSpan]
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
              monthLabelStyle={monthLabelStyle}
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
  <div className="sticky top-0 border-l-2 border-blue-900 bg-white p-4">
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
