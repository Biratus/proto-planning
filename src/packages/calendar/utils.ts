import * as dateFns from "date-fns";
import fr from "date-fns/locale/fr";
import { Interval, Month } from "./types";

const locale = { locale: fr };
/*
  --------
    FORMATING
  --------
*/

export function formatMonthYear(d: Date) {
  return upperFirst(format(d, "MMMM yyyy"));
}
export function formatDayDate(d: Date) {
  return format(d, "dd");
}

export function format(d: Date, f: string) {
  return dateFns.format(d, f, locale);
}

export function formatSimpleDayLabel(d: Date) {
  return upperFirst(format(d, "EEEEE"));
}

/*
  --------
    UTILS
  --------
*/

export function nbOfDaysBetween(start: Date, end: Date) {
  return dateFns.isSameMonth(start, end)
    ? end.getDate() - start.getDate() + 1
    : dateFns.eachDayOfInterval({ start, end }).length;
}
export const makeMonths: (month: Date, length: number) => Month[] = (
  month: Date,
  length: number
) => {
  let months = [];
  for (let i = 0; i <= length; i++) {
    let m = dateFns.addMonths(month, i);
    months.push({
      day: dateFns.startOfMonth(m),
      nbOfDays: dateFns.endOfMonth(m).getDate(),
    });
  }
  return months;
};

/*
  --------
    DISPLAY
  --------
*/
export function moduleDayLabel({ start, end }: Interval) {
  return dateFns.isSameDay(start, end)
    ? formatDayDate(start)
    : formatDayDate(start) + " - " + formatDayDate(end);
}
export function upperFirst(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}
