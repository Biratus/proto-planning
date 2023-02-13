import * as dateFns from "date-fns";
import fr from "date-fns/locale/fr";
import { upperFirst } from "./strings";

const locale = { locale: fr };
/*
  --------
    FORMATING
  --------
*/

export function formatMonthYear(d: Date) {
  return upperFirst(format(d, "MMMM yyyy"));
}

export function formatSimpleDayLabel(d: Date) {
  return upperFirst(format(d, "EEEEE"));
}

export function formatShortDayLabel(d: Date) {
  return upperFirst(format(d, "E"));
}

export function formatFullDayLabel(d: Date) {
  return upperFirst(format(d, "EEEE"));
}

export function formatDayDate(d: Date) {
  return format(d, "dd");
}

export function formatFullDate(d: Date) {
  return format(d, "dd/MM/yy");
}

export function formatFullPrettyDate(d: Date) {
  return `${formatFullDayLabel(d)} ${format(d, "d")} ${formatMonthYear(d)}`;
}

export function formatDateValue(d: Date) {
  return format(d, "yyyy-MM-dd");
}

/*
  --------
    PARSING
  --------
*/

export function parseMonthAndYear(monthStr: string) {
  return parse(monthStr, "MMMM yyyy");
}
export function parseDateValue(date: string) {
  return parse(date, "yyyy-MM-dd");
}
/*
  --------
    FACADE
  --------
*/

export function parse(d: string, format: string) {
  return dateFns.parse(d, format, new Date(), locale);
}

export function format(d: Date, f: string) {
  return dateFns.format(d, f, locale);
}

export function endOfWeek(d: Date) {
  return dateFns.endOfWeek(d, locale);
}
export function startOfWeek(d: Date) {
  return dateFns.startOfWeek(d, locale);
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

export function mapISO<OUT>(list: any[], fields: string[]): Array<OUT> {
  return list.map((item) => {
    let newItem = { ...item };

    fields.forEach((f) => (newItem[f] = dateFns.parseISO(newItem[f])));

    return newItem;
  });
}
