import { createStyle, mergeStyle } from "@/lib/style";
import { isSameDay, isWeekend } from "date-fns";
import { Style } from "../../../../packages/calendar/types";

export const monthLabel = createStyle("font-bold", {
  background:
    "linear-gradient(170deg, hsl(47, 49%, 61%) 0%, hsl(47, 49%, 61%) 9%, rgba(0,0,0,0) 50%)",
});

export const day = createStyle("border-gray-600 border-l");

export const weekend: Style = createStyle("", {
  background:
    "linear-gradient(170deg, #424242 0%, #424242 10%, #ffffff00 100%)",
});

export const missingFormateurStyle: (color: string) => Style = (
  eventColor: string
) =>
  createStyle("", {
    background: `repeating-linear-gradient(30deg,
    transparent,
    ${eventColor} 20%,
    transparent 40%)`,
  });

export const calendarDayStyle: (date: Date) => Style = (date: Date) => {
  let style = { ...day };

  if (isWeekend(date))
    style = {
      className: style.className + " " + weekend.className,
      props: { ...style.props, ...weekend.props },
    };

  return style;
};

export const overlapModuleStyle = createStyle("white", {
  background: "black",
  boxShadow: `0px 0px 0.7em 0.1em #D6C588 inset`,
});

export const dropTargetStyle = createStyle("", { background: "#D6C588" });

// For FullCalendarView
export const eventStyle: (c: string) => Style = (color: string) =>
  mergeStyle(day, {
    className: "",
    props: {
      background: `radial-gradient(circle, ${color} 30%, rgba(148,187,233,0) 100%)`,
    },
  });
// For SimpleView
export const dayEventStyle = (date: Date, event: Interval, color: string) => {
  let isStart = isSameDay(date, event.start);
  let isEnd = isSameDay(date, event.end);

  let background = color;
  if (isStart && isEnd) {
    background = `radial-gradient(circle, ${color} 30%, rgba(148,187,233,0) 100%)`;
  } else if (isStart) {
    background = `radial-gradient(circle at 100%, ${color} 50%, rgba(148,187,233,0) 100%)`;
  } else if (isEnd) {
    background = `radial-gradient(circle at 0%, ${color} 50%, rgba(0,0,0,0) 100%)`;
  }
  return { className: "", props: { background } };
};

export const missingFormateurLegend = {
  label: "Formateur non défini",
  style: missingFormateurStyle("grey"),
};

export const overlapModuleLegend = {
  label: "Modules superposés",
  style: overlapModuleStyle,
};
