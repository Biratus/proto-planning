"use client";

import { Style } from "../styles";
import { CalendarEvent as CalendarEventType, CalendarItem } from "../types";
import { useFullCalendarEvent } from "./FullCalendarProvider";

export default function CalendarEvent<T extends CalendarItem>({
  day: { date, event, span },
  ...props
}: {
  day: CalendarEventType<T>;
}) {
  const { onClick, style, label } = useFullCalendarEvent<T>();

  const styleProps: Style = style(event);

  return (
    <div
      className={`flex items-center px-1 cursor-pointer hover:opacity-60 ${styleProps.className}`}
      style={{
        gridColumnEnd: `span ${span}`,
        ...styleProps.props,
      }}
      onClick={(evt) => onClick(event, evt.currentTarget)}
      {...props}
      draggable
    >
      <span className="truncate">{label(event)}</span>
    </div>
  );
}
