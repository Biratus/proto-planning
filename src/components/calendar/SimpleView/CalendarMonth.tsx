"use client";

import { formatMonthYear } from "@/lib/date";
import { useMemo } from "react";
import { monthLabel } from "../styles";
import { CalendarItem, DayAndEvent } from "../types";
import CalendarCell from "./CalendarCell";

export type CalendarMonthProp<T extends CalendarItem> = {
  days: DayAndEvent<T>[];
  isFirstMonth: boolean;
};

export default function CalendarMonth<T extends CalendarItem>({
  days,
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
          />
        ))}
      </>
    ),
    [days]
  );
}
