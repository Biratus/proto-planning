import { CalendarData, Interval } from "@/packages/calendar/types";
import {
  areIntervalsOverlapping,
  eachDayOfInterval,
  isAfter,
  isBefore,
  isSameDay,
} from "date-fns";
import { formatDayDate, nbOfDaysBetween } from "../date";
import { CalendarView, Module, ModuleEvent } from "../types";

export function toCalendarData<K>(
  data: Module[],
  groupingField: string, // for mapping
  view: CalendarView<K>
): CalendarData<K, ModuleEvent>[] {
  let dataMap = new Map<K, ModuleEvent[]>();
  for (let d of data) {
    // modules list to map
    let index = getDataField(d, groupingField);
    if (!dataMap.has(index)) dataMap.set(index, []);
    let duration = nbOfDaysBetween(d.start, d.end);
    dataMap.get(index)!.push({
      ...d,
      duration,
      filiere: d.filiere || { nom: "Aucune filière" },
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

export function moduleOverlap(m1: Module, m2: Module) {
  return areIntervalsOverlapping(m1, m2, { inclusive: true });
}

export function getOverlapModules(
  modules: Module[]
): (Interval & { overlappedModules: Module[] })[] {
  let overlappedModules: Set<Module>[] = [];

  for (let mod1 of modules) {
    for (let mod2 of modules) {
      if (mod1.id !== mod2.id && moduleOverlap(mod1, mod2)) {
        // 2 modules overlap
        if (!overlappedModules.some((overlapped) => overlapped.has(mod1))) {
          overlappedModules.push(new Set([mod1, mod2]));
        } else {
          const overlappIndex = overlappedModules.findIndex((overlapped) =>
            overlapped.has(mod1)
          );
          overlappedModules[overlappIndex].add(mod2);
        }
      }
    }
  }

  return overlappedModules.map(([...mods]) => ({
    start: mods.reduce(
      (acc: Date | null, m) =>
        (acc = acc == null || isBefore(m.start, acc) ? m.start : acc),
      null
    )!,
    end: mods.reduce(
      (acc: Date | null, m) =>
        (acc = acc == null || isAfter(m.end, acc) ? m.end : acc),
      null
    )!,
    overlappedModules: sortModules(mods),
  }));
}

function sortModules(modules: Module[]) {
  return modules.sort((m1, m2) => m1.start.getTime() - m2.start.getTime());
}

/*
Overlap test data

[in] :
  01/01 -> 04/01
  03/01 -> 05/01

  06/01 -> 07/01

  08/01 -> 09/01
  09/01 -> 10/01
  10/01 -> 11/01

[out]:
  01/01 -> 05/01
      01/01 -> 04/01
      03/01 -> 05/01

  08/01 -> 11/01
      08/01 -> 09/01
      09/01 -> 10/01
      10/01 -> 11/01
*/
