"use client";

import { formatDayDate, formatSimpleDayLabel } from "@/lib/date";
import { mergeStyle } from "@/lib/style";
import { DayComponentProps } from "@/packages/calendar/types";
import cn from "classnames";
import { useMemo } from "react";
import { useDropTarget } from "../../(store)/dragStore";
import { useSpecialDays } from "../../(store)/specialDaysStore";
import { calendarDayStyle, dropTargetStyle } from "./CalendarStyle";

export default function DayComponent({ date, ...props }: DayComponentProps) {
  const { isJoursFeries, getJourFerie } = useSpecialDays();
  const { isDropTarget } = useDropTarget();

  const wholeStyle = useMemo(() => {
    let style = {
      ...calendarDayStyle(date),
    };
    if (isJoursFeries(date)) style.className = "text-red-600";
    if (isDropTarget(date)) style = mergeStyle(style, dropTargetStyle);

    return style;
  }, [date, isDropTarget, isJoursFeries]);

  return (
    <div
      className={cn({
        [`text-center ${wholeStyle.className} ${props.className}`]: true,
        tooltip: isJoursFeries(date),
      })}
      style={{
        ...props.style,
        ...wholeStyle.props,
      }}
      data-tip={getJourFerie(date)}
    >
      <div>{formatSimpleDayLabel(date)}</div>
      <div>{formatDayDate(date)}</div>
    </div>
  );
}
