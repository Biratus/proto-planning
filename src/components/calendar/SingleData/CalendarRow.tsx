import { moduleDayLabel } from "@/lib/calendar";
import { eachDayOfInterval } from "date-fns";
import { MouseEvent, useCallback, useContext } from "react";
import { emptyStyle, Style } from "../styles";
import { CalendarDetailRowProps, Interval } from "../types";

export default function CalendarRow<T extends Interval>({
  event,
  AdditionalInfo,
  context,
}: CalendarDetailRowProps<T>) {
  const { start, end } = event;

  const { color, eventHighlighted, highlightedProps, onClick, label } =
    useContext(context);

  let dayNb = eachDayOfInterval({ start, end }).length;

  const highlightedStyle: Style = eventHighlighted(event)
    ? highlightedProps(color(event))
    : emptyStyle();

  const eventClick = useCallback(
    (evt: MouseEvent) => {
      onClick(event, evt);
    },
    [onClick]
  );
  return (
    <>
      <div
        className="border-b dark:border-white border-gray-500 pl-3"
        style={{ gridRowEnd: "span " + dayNb }}
      >
        {moduleDayLabel(event)}
      </div>
      <div
        className={`border-b dark:border-white border-gray-500 pl-3 cursor-pointer truncate hover:opacity-60 ${highlightedStyle.className}`}
        style={{
          backgroundColor: color(event),
          ...highlightedStyle.props,
          gridRowEnd: "span " + dayNb,
        }}
        onClick={eventClick}
      >
        {label(event)}
      </div>
      <div
        className="border-b dark:border-white border-gray-500 pl-3"
        style={{ gridRowEnd: "span " + dayNb }}
      >
        <AdditionalInfo event={event} />
      </div>
    </>
  );
}