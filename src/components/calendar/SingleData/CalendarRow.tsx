import { moduleDayLabel } from "@/lib/calendar";
import { eachDayOfInterval } from "date-fns";
import { MouseEvent, useCallback } from "react";
import { Style } from "../styles";
import { CalendarDetailRowProps, Interval } from "../types";

export default function CalendarRow<T extends Interval>({
  event,
  AdditionalInfo,
  eventProps,
}: CalendarDetailRowProps<T>) {
  const { start, end } = event;

  const { style, onClick, label } = eventProps;

  let dayNb = eachDayOfInterval({ start, end }).length;

  const styleProps: Style = style(event);

  const eventClick = useCallback(
    (evt: MouseEvent<HTMLElement>) => {
      onClick(event, evt.currentTarget);
    },
    [onClick, event]
  );
  return (
    <>
      <div
        className="border-b border-gray-500 pl-3 dark:border-white"
        style={{ gridRowEnd: "span " + dayNb }}
      >
        {moduleDayLabel(event)}
      </div>
      <div
        className={`cursor-pointer truncate border-b border-gray-500 pl-3 hover:opacity-60 dark:border-white ${styleProps.className}`}
        style={{
          gridRowEnd: "span " + dayNb,
          ...styleProps.props,
        }}
        onClick={eventClick}
      >
        {label(event)}
      </div>
      <div
        className="border-b border-gray-500 pl-3 dark:border-white"
        style={{ gridRowEnd: "span " + dayNb }}
      >
        <AdditionalInfo event={event} />
      </div>
    </>
  );
}
