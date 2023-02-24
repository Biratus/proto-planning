"use client";

import {
  CalendarEvent as CalendarEventType,
  CalendarEventComponent,
  CalendarEventComponentProps,
  CalendarItem,
} from "../types";
import { useFullCalendarEvent } from "./FullCalendarProvider";

export const defaultEventElement = ({
  event,
  children,
  ...props
}: CalendarEventComponentProps<CalendarItem>) => (
  <div {...props}>{children}</div>
);

export default function CalendarEvent<
  T extends CalendarItem,
  E extends CalendarEventComponent<T> = typeof defaultEventElement
>({ day: { event, span }, ...props }: { day: CalendarEventType<T> }) {
  const { onClick, style, label, as } = useFullCalendarEvent<T, E>();

  const styleProps = style(event);

  const Component = as ?? defaultEventElement;

  return (
    <Component
      className={`flex cursor-pointer items-center hover:opacity-60 ${styleProps.className}`}
      style={{
        gridColumnEnd: `span ${span}`,
        ...styleProps.props,
      }}
      onClick={(evt) => onClick(event, evt.currentTarget)}
      {...props}
      draggable
      event={event}
    >
      <span className="truncate">{label(event)}</span>
    </Component>
  );
}
