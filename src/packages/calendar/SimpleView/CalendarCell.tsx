"use client";

import { isSameDay } from "date-fns";
import {
  CalendarEventComponentProps,
  CalendarItem,
  DayAndEvent,
} from "../types";
import { formatDayDate } from "../utils";
import { useHover } from "./HoverProvider";
import { useSimpleCalendar } from "./SimpleCalendarProvider";

export const defaultSimpleEventElement = ({
  event,
  children,
  ...props
}: CalendarEventComponentProps<CalendarItem>) => (
  <div {...props}>{children}</div>
);

export default function CalendarCell<T extends CalendarItem>({
  day: { date, event },
  forceEventLabel,
}: {
  day: DayAndEvent<T>;
  forceEventLabel: boolean;
}) {
  const {
    cellHeight: height,
    event: eventProps,
    day: { tooltip: dayTooltip, styleProps: dayStyleProps },
  } = useSimpleCalendar();

  const { hover, hoverMe, unHoverMe } = useHover(event?.id);

  const gridColumnStart = () => {
    if (date.getDate() != 1) return "auto";
    return date.getDay() || 7;
  };

  const Day = <div className="p-2">{formatDayDate(date)}</div>;

  const styleProps = eventProps.style(date, event);

  const Component = eventProps.as ?? defaultSimpleEventElement;

  return (
    <div
      className={`flex flex-col ${dayStyleProps(date).className}`}
      style={{
        ...dayStyleProps(date).props,
        gridColumnStart: gridColumnStart(),
        height,
      }}
    >
      <div
        className={`${dayTooltip.hasTooltip(date) ? "tooltip text-left" : ""}`}
        data-tip={dayTooltip.tooltipInfo(date)}
      >
        {Day}
      </div>

      {event && (
        <Component
          className={`flex flex-grow cursor-pointer items-center pl-2 ${styleProps.className}`}
          style={{
            ...styleProps.props,
            opacity: hover ? 0.6 : 1,
          }}
          onMouseEnter={hoverMe!}
          onMouseLeave={unHoverMe!}
          onClick={(evt) => eventProps.onClick(event, evt.currentTarget)}
          event={event}
        >
          <span
            className={`${
              isSameDay(event.start, date)
                ? "z-10 whitespace-nowrap"
                : "truncate"
            }`}
          >
            {(forceEventLabel || isSameDay(event.start, date)) &&
              eventProps.label(event)}
          </span>
        </Component>
      )}
    </div>
  );
}