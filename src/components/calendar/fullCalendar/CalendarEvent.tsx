"use client";

import { Context, useContext } from "react";
import { Style } from "../styles";
import {
  CalendarEvent as CalendarEventType,
  FullCalendarContext,
} from "../types";

export default function CalendarEvent<T>({
  day: { date, event, span },
  ctx,
}: {
  day: CalendarEventType<T>;
} & { ctx: Context<FullCalendarContext<T>> }) {
  const { commonDayStyle, eventProps } = useContext(ctx);
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
