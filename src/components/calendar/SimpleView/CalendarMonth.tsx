"use client";

import { formatMonthYear } from "@/lib/date";
import { Context, useMemo } from "react";
import { monthLabel } from "../styles";
import { CalendarItem, DayAndEvent, SimpleCalendarContext } from "../types";
import CalendarCell from "./CalendarCell";

export type CalendarMonthProp<T extends CalendarItem> = {
  days: DayAndEvent<T>[];
  context: Context<SimpleCalendarContext<T>>;
  isFirstMonth: boolean;
};

export default function CalendarMonth<T extends CalendarItem>({
  days,
  context,
  isFirstMonth,
}: CalendarMonthProp<T>) {
  return useMemo(
    () => (
      <>
        <div
          className={`col-span-7 p-1 top-11 ${monthLabel.className}`}
          style={monthLabel.props}
        >
          {formatMonthYear(days[0].date)}
        </div>
        {days.map((d, id) => (
          <CalendarCell
            key={id}
            day={d}
            forceEventLabel={id == 0 && isFirstMonth}
            ctx={context}
          />
        ))}
      </>
    ),
    [days]
  );
}
