"use client";

import { Style } from "../styles";
import { CalendarEvent as CalendarEventType } from "../types";
import { useFullCalendarEvent } from "./FullCalendarProvider";

export default function CalendarEvent<T extends Interval>({
  day: { date, event, span },
}: {
  day: CalendarEventType<T>;
}) {
  const { commonDayStyle, eventProps } = useFullCalendarEvent();
  const {
    highlighted: eventHighlighted,
    highlightedProps,
    onClick,
    color,
    label,
  } = eventProps!;

  const styleProps: Style = eventHighlighted(event)
    ? highlightedProps(event)
    : { className: "" };

  return (
    <div
      className={`flex items-center px-1 cursor-pointer hover:opacity-60 ${
        commonDayStyle!(date).className
      }${styleProps.className}`}
      style={{
        background: `radial-gradient(circle, ${color(
          event
        )} 30%, rgba(148,187,233,0) 100%)`,
        gridColumnEnd: `span ${span}`,
        ...styleProps.props,
      }}
      onClick={(evt) => onClick(event, evt.currentTarget)}
    >
      <span className="truncate">{label(event)}</span>
    </div>
  );
}
