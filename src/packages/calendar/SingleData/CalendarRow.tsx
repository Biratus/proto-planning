import { eachDayOfInterval } from "date-fns";
import { MouseEvent, useCallback } from "react";
import {
  CalendarDetailRowProps,
  Interval,
  SingleCalendarEventComponent,
  SingleCalendarEventComponentProps,
  Style,
} from "../types";
import { moduleDayLabel } from "../utils";
export const defaultSingleEventElement = ({
  children,
  ...props
}: SingleCalendarEventComponentProps<Interval>) => (
  <div {...props}>{children}</div>
);
export default function CalendarRow<
  T extends Interval,
  E extends SingleCalendarEventComponent<T>
>({ event, AdditionalInfo, eventProps }: CalendarDetailRowProps<T, E>) {
  const { start, end } = event;

  const { style, onClick, label, as } = eventProps;

  let dayNb = eachDayOfInterval({ start, end }).length;

  const styleProps: Style = style(event);

  const eventClick = useCallback(
    (evt: MouseEvent<HTMLElement>) => {
      onClick(event, evt.currentTarget);
    },
    [onClick, event]
  );

  const Component = as ?? defaultSingleEventElement;

  return (
    <>
      <div
        className="border-b border-gray-500 pl-3 dark:border-white"
        style={{ gridRowEnd: "span " + dayNb }}
      >
        {moduleDayLabel(event)}
      </div>
      <Component
        className={`cursor-pointer truncate border-b border-gray-500 pl-3 hover:opacity-60 dark:border-white ${styleProps.className}`}
        style={{
          gridRowEnd: "span " + dayNb,
          ...styleProps.props,
        }}
        onClick={eventClick}
      >
        {label(event)}
      </Component>
      <div
        className="border-b border-gray-500 pl-3 dark:border-white"
        style={{ gridRowEnd: "span " + dayNb }}
      >
        <AdditionalInfo event={event} />
      </div>
    </>
  );
}
