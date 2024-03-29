import cn from "classnames";
import {
  addDays,
  areIntervalsOverlapping,
  eachDayOfInterval,
  endOfMonth,
  isAfter,
  isBefore,
  startOfMonth,
} from "date-fns";
import { useMemo } from "react";
import { CalendarItem, CalendarProps, Month, Style } from "../types";
import { formatMonthYear, makeMonths, nbOfDaysBetween } from "../utils";
import CalendarRow from "./CalendarRow";
import FullCalendarProvider from "./FullCalendarProvider";

const minCellSize = 20;

export default function FullCalendar<K, T extends CalendarItem>({
  data: originalData,
  LabelComponent,
  timeSpan,
  event: eventComponent,
  day,
  zoom,
  monthLabelStyle,
  drag,
  daysHeader,
  dayStyle,
}: CalendarProps<K, T>) {
  const DayComponent = day;

  const months = useMemo(
    () => makeMonths(timeSpan.start, timeSpan.end),
    [timeSpan]
  );
  const dayLimit = endOfMonth(months[months.length - 1].day);
  // Only display data that is within the month interval
  const data = originalData.filter((d) =>
    dataOverlapInterval(d.events, {
      start: startOfMonth(months[0].day),
      end: endOfMonth(months[months.length - 1].day),
    })
  );

  const days = eachDayOfInterval({
    start: startOfMonth(months[0].day),
    end: dayLimit,
  });

  const daysRow = useMemo(() => {
    return days.map((day, i) => (
      <DayComponent
        key={i}
        className={cn({
          "col-start-2": i == 0,
          "col-start-auto": i != 0,
        })}
        date={day}
      />
    ));
  }, [days, DayComponent]);

  const monthRow = useMemo(() => {
    return months.map((m, i) => (
      <Month style={monthLabelStyle} month={m} key={i} first={i == 0} />
    ));
  }, [months, monthLabelStyle]);

  const daysHeaderRow = useMemo(() => {
    if (!daysHeader) return null;
    let elements = [];
    let prev = timeSpan.start;
    for (let dayHeader of daysHeader) {
      if (isBefore(dayHeader.start, timeSpan.start)) {
        dayHeader.start = timeSpan.start;
        dayHeader.duration = nbOfDaysBetween(timeSpan.start, dayHeader.end);
      }
      let duration = nbOfDaysBetween(prev, dayHeader.start) - 1;
      if (duration > 0) {
        elements.push(
          <div
            key={elements.length}
            style={{
              gridColumnStart: elements.length == 0 ? "2" : "auto",
              gridColumnEnd: "span " + duration,
            }}
          ></div>
        );
      }
      elements.push(
        <DayHeader
          key={elements.length}
          first={elements.length == 0}
          span={
            isAfter(dayHeader.end, dayLimit)
              ? nbOfDaysBetween(dayHeader.start, dayLimit)
              : dayHeader.duration
          }
          {...dayHeader}
        />
      );
      prev = addDays(dayHeader.end, 1);
    }
    if (isBefore(prev, dayLimit)) {
      let missingDuration = nbOfDaysBetween(prev, dayLimit);
      elements.push(
        <div
          key={elements.length}
          style={{
            gridColumnEnd: "span " + missingDuration,
          }}
        ></div>
      );
    }
    return elements;
  }, [timeSpan, daysHeader, dayLimit]);

  return (
    <FullCalendarProvider
      {...{
        days,
        dayStyle,
        eventComponent,
        drag,
      }}
    >
      <div
        className="grid overflow-x-auto pb-5"
        style={{
          gridTemplateColumns: `${10 + zoom}% repeat(${days.length},${
            minCellSize + zoom * 5
          }px)`,
          gridTemplateRows: `1fr ${daysHeader ? "auto" : ""} 1fr ${
            data.length ? `repeat(${data.length},${cellHeight(zoom)}px)` : ""
          }`,
        }}
      >
        {monthRow}
        {daysHeader && daysHeaderRow}
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
      className={cn({
        [`${style.className} flex items-center pl-5`]: true,
        "col-start-2": first,
        "col-start-auto": !first,
      })}
      style={{ ...style.props, gridColumnEnd: `span ${nbOfDays}` }}
    >
      {formatMonthYear(day)}
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

function DayHeader({
  span,
  info,
  color,
  textColor,
  label,
  first,
}: {
  span: number;
  info: string;
  label: string;
  textColor: string;
  color: string;
  first: boolean;
}) {
  return (
    <div
      className="tooltip tooltip-top hover:brightness-75"
      style={{
        gridColumnStart: first ? "2" : "auto",
        gridColumnEnd: "span " + span,
        background: color,
        color: textColor,
      }}
      data-tip={info}
    >
      <div className="truncate px-2">{label}</div>
    </div>
  );
}
