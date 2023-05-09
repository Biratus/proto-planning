"use client";

import {
  CalendarEvent as CalendarEventType,
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

export default function CalendarEvent<T extends CalendarItem>({
  day: { event, span },
  ...props
}: {
  day: CalendarEventType<T>;
}) {
  const as = useFullCalendarEvent<T>();

  const Component = as ?? defaultEventElement;

  return (
    <Component
      className={`flex cursor-pointer items-center hover:opacity-60`}
      style={{
        gridColumnEnd: `span ${span}`,
      }}
      {...props}
      draggable
      event={event}
    />
  );
}
