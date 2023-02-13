import { CalendarData, Interval, Month } from "@/components/calendar/types";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  startOfMonth,
} from "date-fns";
import { formatDayDate } from "./date";
import { moduleOverlap } from "./realData";
import { CalendarView, Module, ModuleEvent, RawModule } from "./types";

export function toCalendarData<K>(
  data: RawModule[] | Module[],
  groupingField: string, // for mapping
  view: CalendarView<K>
): CalendarData<K, ModuleEvent>[] {
  let dataMap = new Map<K, ModuleEvent[]>();
  for (let d of data) {
    // modules list to map
    let index = getDataField(d, groupingField);

    if (!dataMap.has(index)) dataMap.set(index, []);
    let start = typeof d.start === "string" ? parseISO(d.start) : d.start;
    let end = typeof d.end === "string" ? parseISO(d.end) : d.end;
    let duration = eachDayOfInterval({ start, end }).length;
    dataMap.get(index)!.push({
      ...d,
      start,
      end,
      duration,
    });
  }

  let calendarData = [];
  for (let key of dataMap.keys()) {
    // Iterate over rows
    let events = dataMap.get(key);
    let keyObject = view.keyObject(events![0]);
    calendarData.push({
      key: keyObject,
      labelTitle: view.labelTitle(keyObject),
      events: dataMap.get(key)!,
    });
  }
  calendarData.sort((a, b) => a.labelTitle.localeCompare(b.labelTitle));
  return calendarData;
}

function getDataField(object: any, field: string) {
  let target = object;
  for (let subField of field.split(".")) target = target[subField];
  return target;
}

export function mergeModule(dest: ModuleEvent, mod: ModuleEvent): ModuleEvent {
  let newModule = { overlap: true, ...dest, name: "Module superposés" };
  if (isBefore(mod.start, dest.start)) newModule.start = mod.start;
  if (isAfter(mod.end, dest.end)) newModule.end = mod.end;
  newModule.overlappedModules
    ? newModule.overlappedModules.push(mod)
    : (newModule.overlappedModules = [dest, mod]);
  return newModule;
}

export async function getJoursFeries(year: number) {
  try {
    const resp = await fetch(
      `https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`,
      { next: { revalidate: 60 * 60 * 24 } }
    );
    return resp.json();
  } catch (e) {
    throw e;
  }
}

export const makeMonths: (month: Date, length: number) => Month[] = (
  month: Date,
  length: number
) => {
  let months = [];
  for (let i = 0; i <= length; i++) {
    let m = addMonths(month, i);
    months.push({ day: startOfMonth(m), nbOfDays: endOfMonth(m).getDate() });
  }
  return months;
};

export type JoursFeries = { [key: string]: string };

export async function getAllJoursFeries(
  monthStart: Date
): Promise<JoursFeries> {
  let currentYear = monthStart.getFullYear();
  try {
    const prev = await getJoursFeries(currentYear - 1);
    const curr = await getJoursFeries(currentYear);
    const next = await getJoursFeries(currentYear + 1);

    return { ...prev, ...curr, ...next };
  } catch (e) {
    console.error(e);
    console.error("Could not load jours-feries");
    return {};
  }
}

export function moduleDayLabel({ start, end }: Interval) {
  return isSameDay(start, end)
    ? formatDayDate(start)
    : formatDayDate(start) + " - " + formatDayDate(end);
}

export function checkOverlapModules<K>(data: CalendarData<K, ModuleEvent>[]) {
  for (let row of data) {
    let newEvents: ModuleEvent[] = [];
    for (let mod of row.events) {
      let overlap: ModuleEvent | undefined = undefined;
      for (let i = 0; i < newEvents.length; i++) {
        let event = newEvents[i];
        if (moduleOverlap(mod, event)) {
          overlap = overlap
            ? mergeModule(overlap, event)
            : mergeModule(event, mod);
          newEvents.splice(i, 1);
          i--;
        }
      }
      if (!overlap) newEvents.push(mod);
      else {
        overlap.duration = eachDayOfInterval(overlap).length;
        newEvents.push(overlap);
      }
    }
    row.events = newEvents;
  }
}
