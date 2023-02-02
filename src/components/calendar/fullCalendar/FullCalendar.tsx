"use client";

import { makeMonths } from "@/lib/calendar";
import {
  formatDayDate,
  formatMonthYear,
  formatSimpleDayLabel,
} from "@/lib/date";
import {
  areIntervalsOverlapping,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
} from "date-fns";
import { createContext, useMemo, useRef } from "react";
import { monthLabel, Style } from "../styles";
import {
  CalendarProps,
  FullCalendarContext,
  IntervalWithDuration,
  Month,
} from "../types";
import CalendarRow from "./CalendarRow";

const minCellSize = 20;

export default function FullCalendar<K, T extends IntervalWithDuration>({
  data: originalData,
  LabelComponent,
  EventTooltip,
  time: { start, monthLength },
  event: eventProps,
  day,
  commonDayStyle,
  zoom,
  drag,
}: CalendarProps<K, T>) {
  const {
    tooltip: { hasTooltip, tooltipInfo },
    styleProps,
  } = day;

  const month = start;
  const months = useMemo(
    () => makeMonths(month, monthLength - 1),
    [month, monthLength]
  );

  // Only display data that is within the month interval
  const data = originalData.filter((d) =>
    dataOverlapInterval(d.events, {
      start: startOfMonth(months[0].day),
      end: endOfMonth(months[months.length - 1].day),
    })
  );

  const dayLimit = endOfMonth(months[months.length - 1].day);
  const days = eachDayOfInterval({
    start: startOfMonth(months[0].day),
    end: dayLimit,
  });

  const daysRow = useMemo(() => {
    return days.map((day, i) => (
      <Day key={i} first={i == 0} day={day} style={styleProps(day)} />
    ));
  }, [days, hasTooltip, tooltipInfo, styleProps]);

  const monthRow = useMemo(() => {
    return months.map((m, i) => <Month month={m} key={i} first={i == 0} />);
  }, [months]);

  const FullContext = useRef(createContext<FullCalendarContext<T>>({})).current;
  return (
    <FullContext.Provider
      value={{
        days,
        eventProps,
        commonDayStyle,
        drag,
      }}
    >
      <div
        className={`grid pb-5 overflow-x-auto gap-px`}
        style={{
          gridTemplateColumns: `${10 + zoom}% repeat(${days.length},${
            minCellSize + zoom * 5
          }px)`,
          gridTemplateRows: `1fr 1fr ${
            data.length ? `repeat(${data.length},${cellHeight(zoom)}px)` : ""
          }`,
        }}
      >
        {monthRow}
        {daysRow}
        {/* Data */}
        {data.map((d, i) => (
          <CalendarRow
            ctx={FullContext}
            key={i}
            events={d.events}
            // EventTooltip={EventTooltip}
            labelProps={{
              key: d.key,
              title: d.labelTitle,
              LabelComponent: LabelComponent,
            }}
          />
        ))}
      </div>
    </FullContext.Provider>
  );
}

function Month({
  month: { nbOfDays, day },
  first,
}: {
  month: Month;
  first: boolean;
}) {
  return (
    <div
      className={`${monthLabel.className} pl-5 flex items-center ${
        first ? "col-start-2" : "col-start-auto"
      }`}
      style={{ ...monthLabel.props, gridColumnEnd: `span ${nbOfDays}` }}
    >
      {formatMonthYear(day)}
    </div>
  );
}

function Day({
  day,
  first,
  style,
}: {
  day: Date;
  first: boolean;
  style: Style;
}) {
  return (
    <div
      className={`text-center ${first ? "col-start-2" : "col-start-auto"} ${
        style.className
      }`}
      style={style.props}
    >
      <div>{formatSimpleDayLabel(day)}</div>
      <div>{formatDayDate(day)}</div>
    </div>
  );
}

const dataOverlapInterval = (data: Interval[], interval: Interval) => {
  return data.some(({ start, end }) =>
    areIntervalsOverlapping({ start, end }, interval, { inclusive: true })
  );
};

export function cellHeight(coef: number) {
  return minCellSize + coef * 5;
}
