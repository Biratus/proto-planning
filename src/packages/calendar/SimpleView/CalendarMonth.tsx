"use client";

import { useMemo } from "react";
import { CalendarDay, CalendarItem, Style } from "../types";
import { formatMonthYear } from "../utils";
import CalendarCell from "./CalendarCell";

type CalendarMonthProp<T extends CalendarItem> = {
  days: CalendarDay<T>[];
  isFirstMonth: boolean;
  monthLabelStyle: Style;
};

export default function CalendarMonth<T extends CalendarItem>({
  days,
  isFirstMonth,
  monthLabelStyle,
}: CalendarMonthProp<T>) {
  return useMemo(
    () => (
      <>
        <div
          className={`col-span-7 p-4 ${monthLabelStyle.className}`}
          style={monthLabelStyle.props}
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
    [days, isFirstMonth, monthLabelStyle]
  );
}
