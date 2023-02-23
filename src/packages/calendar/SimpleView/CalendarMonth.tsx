"use client";

import { useMemo } from "react";
import { CalendarItem, DayAndEvent, Style } from "../types";
import { formatMonthYear } from "../utils";
import CalendarCell from "./CalendarCell";

export type CalendarMonthProp<T extends CalendarItem> = {
  days: DayAndEvent<T>[];
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
          style={monthLabelStyle.props} // TODO REFACTO
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
    [days, isFirstMonth]
  );
}
