"use client";

import {
  areIntervalsOverlapping,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
} from "date-fns";
import { useMemo } from "react";
import {
  CalendarEventComponent,
  CalendarItem,
  CalendarProps,
  Month,
  Style,
} from "../types";
import {
  formatDayDate,
  formatMonthYear,
  formatSimpleDayLabel,
  makeMonths,
} from "../utils";
import CalendarRow from "./CalendarRow";
import FullCalendarProvider from "./FullCalendarProvider";

const minCellSize = 20;

export default function FullCalendar<
  K,
  T extends CalendarItem,
  E extends CalendarEventComponent<T>
>({
  data: originalData,
  LabelComponent,
  time: { start, monthLength },
  event: eventProps,
  day,
  zoom,
  monthLabelStyle,
  drag,
}: CalendarProps<K, T, E>) {
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
      <Day
        key={i}
        first={i == 0}
        day={day}
        style={styleProps(day)}
        specialInfo={hasTooltip(day) ? tooltipInfo(day) : null}
      />
    ));
  }, [days, hasTooltip, tooltipInfo, styleProps]);

  const monthRow = useMemo(() => {
    return months.map((m, i) => (
      <Month style={monthLabelStyle} month={m} key={i} first={i == 0} />
    ));
  }, [months]);

  return (
    <FullCalendarProvider
      {...{
        days,
        eventProps,
        dayStyle: styleProps,
        drag,
      }}
    >
      <div
        className={`grid overflow-x-auto pb-5`}
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
            key={i}
            events={d.events}
            labelProps={{
              key: d.key,
              title: d.labelTitle,
              LabelComponent: LabelComponent,
            }}
          />
        ))}
      </div>
    </FullCalendarProvider>
  );
}

function Month({
  month: { nbOfDays, day },
  first,
  style,
}: {
  month: Month;
  first: boolean;
  style: Style;
}) {
  return (
    <div
      className={`${style.className} flex items-center pl-5 ${
        first ? "col-start-2" : "col-start-auto"
      }`}
      style={{ ...style.props, gridColumnEnd: `span ${nbOfDays}` }}
    >
      {formatMonthYear(day)}
    </div>
  );
}

function Day({
  day,
  first,
  style,
  specialInfo,
}: {
  day: Date;
  first: boolean;
  style: Style;
  specialInfo?: string;
}) {
  return (
    <div
      className={`text-center ${first ? "col-start-2" : "col-start-auto"} ${
        style.className
      }
      ${specialInfo ? "tooltip" : ""}
      `}
      style={style.props}
      data-tip={specialInfo}
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
