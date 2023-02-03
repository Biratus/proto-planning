"use client";

import { formatDayDate } from "@/lib/date";
import { isSameDay } from "date-fns";
import { Context, useContext } from "react";
import { backgroundFor, Style } from "../styles";
import { CalendarItem, DayAndEvent, SimpleCalendarContext } from "../types";
import { useHover } from "./HoverProvider";

export default function CalendarCell<T extends CalendarItem>({
  day: { date, event },
  forceEventLabel,
  ctx,
}: {
  day: DayAndEvent<T>;
  forceEventLabel: boolean;
  ctx: Context<SimpleCalendarContext<T>>;
}) {
  const {
    cellHeight: height,
    event: eventProps,
    day: { tooltip: dayTooltip, styleProps: dayStyleProps },
  } = useContext(ctx);

  const { hover, hoverMe, unHoverMe } = useHover(event?.id);
  //   const EventTooltip = eventProps.EventTooltip;

  const gridColumnStart = () => {
    if (date.getDate() != 1) return "auto";
    return date.getDay() || 7;
  };

  const highlighted = event && eventProps.highlighted(event);

  const Day = <div className="p-2">{formatDayDate(date)}</div>;

  const highlightProps: Style = highlighted
    ? eventProps.highlightedProps(event)
    : { className: "" };
  return (
    <div
      className={`flex flex-col ${dayStyleProps(date).className}`}
      style={{
        ...dayStyleProps(date).props,
        gridColumnStart: gridColumnStart(),
        height,
        opacity: hover ? 0.6 : 1,
      }}
    >
      <div
        className={`${dayTooltip.hasTooltip(date) ? "tooltip text-left" : ""}`}
        data-tip={dayTooltip.tooltipInfo(date)}
      >
        {Day}
      </div>

      {event && (
        <div
          className={`pl-2 flex-grow cursor-pointer flex items-center ${highlightProps.className}`}
          style={{
            background: `${backgroundFor(
              date,
              event,
              eventProps.color(event)
            )}`,
            ...highlightProps.props,
          }}
          onMouseEnter={hoverMe!}
          onMouseLeave={unHoverMe!}
          onClick={(evt) => eventProps.onClick(event, evt.currentTarget)}
        >
          <span
            className={`${
              isSameDay(event.start, date)
                ? "whitespace-nowrap z-10"
                : "truncate"
            }`}
          >
            {(forceEventLabel || isSameDay(event.start, date)) &&
              eventProps.label(event)}
          </span>
        </div>
      )}
    </div>
  );
}
