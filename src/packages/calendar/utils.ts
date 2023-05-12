import * as dateFns from "date-fns";
import fr from "date-fns/locale/fr";
import { Month } from "./types";

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

function format(d: Date, f: string) {
  return dateFns.format(d, f, locale);
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
export const makeMonths: (monthStart: Date, monthEnd: Date) => Month[] = (
  monthStart: Date,
  monthEnd: Date
) => {
  return dateFns
    .eachMonthOfInterval({
      start: monthStart,
      end: monthEnd,
    })
    .map((m) => ({
      day: m,
      nbOfDays: dateFns.endOfMonth(m).getDate(),
    }));
};

/*
  --------
    DISPLAY
  --------
*/
function upperFirst(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}
