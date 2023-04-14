import { Interval } from "@/packages/calendar/types";
import {
  addDays,
  areIntervalsOverlapping,
  formatISO,
  parseISO,
} from "date-fns";
import { Color, colorFromZones, isDark } from "../colors";
import { nbOfDaysBetween } from "../date";

export type VacanceScolaire = Interval & {
  label: string;
  zone: string;
};
type VacanceScolaireData = {
  description: string;
  start_date: string;
  end_date: string;
  zones: string;
};
export type VacanceData = {
  start: Date;
  end: Date;
  labels: string[];
  zones: string[];
};
export type SerializedVacanceData = {
  start: string;
  end: string;
  labels: string[];
  zones: string[];
};
type Moment = {
  date: Date;
  prop: "start" | "end";
};
type TempVacanceData = {
  start: Date;
  end: Date;
  zones: Set<string>;
  labels: Set<string>;
};

export async function getVacancesScolaire(
  start: Date,
  end: Date
): Promise<VacanceScolaire[]> {
  return fetchVacanceScolaire(vacanceScolaireAPIURL(start, end));
}

async function fetchVacanceScolaire(url: string) {
  try {
    const resp = await fetch(
      url
      // { next: { revalidate: 60 * 60 * 24 } }
    );
    // const resp = await fetch(
    //   `https://data.education.gouv.fr/api/v2/catalog/datasets/fr-en-calendrier-scolaire/records?select=description,start_date,end_date,zones&where=start_date>'2022-01-01T00:00:00' and end_date<'2022-03-03T00:00:00'&sort=start_date&offset=0&timezone=UTC&limit=100`
    // );
    return processVacanceScolaire(await resp.json());
  } catch (e) {
    throw e;
  }
}

function vacanceScolaireAPIURL(start: Date, end: Date) {
  return `https://data.education.gouv.fr/api/v2/catalog/datasets/fr-en-calendrier-scolaire/records?select=description,start_date,end_date,zones&where=start_date>'${formatISO(
    start
  )}' and end_date<'${formatISO(
    end
  )}'&sort=start_date&offset=0&timezone=UTC&limit=100&refine=zones:Zone A&refine=zones:Zone B&refine=zones:Zone C`;
}

function processVacanceScolaire(jsonData: any) {
  return jsonData.records.map(
    ({
      record: {
        fields: { description, start_date, end_date, zones },
      },
    }: {
      record: { fields: VacanceScolaireData };
    }) => ({
      label: description,
      start: parseISO(start_date),
      end: parseISO(end_date),
      zone: zones,
    })
  );
}

export function getSWRVacancesScolaire(start: Date, end: Date) {
  return [vacanceScolaireAPIURL(start, end), fetchVacanceScolaire];
}

export function makeVacancesData(
  vacanceInput: VacanceScolaire[]
): VacanceData[] {
  // Merge population:
  // Il y a différentes donées pour des mêmes vacances mais avec différentes population (élèves/prof...)
  const mergedVacances = mergeSameVacance(
    vacanceInput.filter((v) => v.zone != "" && v.label != "")
  );

  // Merge interval: Transforme les vacances qui se superpose entre zones
  const intervals: TempVacanceData[] = [];
  mergedVacances.forEach((vacance) => {
    let tempVacance = {
      labels: new Set([vacance.label]),
      zones: new Set([vacance.zone]),
      start: vacance.start,
      end: vacance.end,
    };
    const conflictingIntervals = intervals.filter((interval) =>
      areIntervalsOverlapping(interval, vacance, { inclusive: true })
    );
    if (conflictingIntervals.length > 0) {
      let newIntervals = mergeIntervals(conflictingIntervals, tempVacance);
      for (let conflict of conflictingIntervals) {
        intervals.splice(intervals.indexOf(conflict), 1);
      }
      intervals.push(...newIntervals);
    } else {
      intervals.push(tempVacance);
    }
  });

  return intervals.map((i) => ({
    ...i,
    zones: Array.from(i.zones),
    labels: Array.from(i.labels),
  }));
}

function mergeSameVacance(input: VacanceScolaire[]): VacanceScolaire[] {
  const mergedVacances: VacanceScolaire[] = [];
  input.forEach((vacance) => {
    const conflicts = mergedVacances.filter(
      (vac) => vac.label == vacance.label && vac.zone == vacance.zone
    );

    if (conflicts.length > 0) {
      let newStart = Math.min(
        vacance.start.getTime(),
        ...conflicts.map((c) => c.start.getTime())
      );
      let newEnd = Math.max(
        vacance.end.getTime(),
        ...conflicts.map((c) => c.end.getTime())
      );
      for (let c of conflicts) {
        mergedVacances.splice(mergedVacances.indexOf(c), 1);
      }
      mergedVacances.push({
        ...vacance,
        start: new Date(newStart),
        end: new Date(newEnd),
      });
    } else mergedVacances.push(vacance);
  });
  return mergedVacances;
}

function mergeIntervals(
  conflicts: TempVacanceData[],
  interval: TempVacanceData
) {
  const dates: Moment[] = [];
  // make and sort date array by date asc, store start/end -> date
  for (let c of [...conflicts, interval]) {
    dates.push({ prop: "start", date: c.start });
    dates.push({ prop: "end", date: c.end });
  }

  dates.sort(intervalSort);

  const newIntervals = makeIntervals(dates);
  for (let newInterval of newIntervals) {
    for (let i of [...conflicts, interval]) {
      // add zone value for new intervals
      if (areIntervalsOverlapping(newInterval, i, { inclusive: true })) {
        i.zones.forEach((z) => newInterval.zones.add(z));
        i.labels.forEach((z) => newInterval.labels.add(z));
      }
    }
  }
  return newIntervals;
}

function makeIntervals(dates: Moment[]): TempVacanceData[] {
  // from sorted array of dates (prop:'start'|'end', date:Date)
  const newIntervals = [];
  for (let i = 0; i < dates.length - 1; i++) {
    let currProp = dates[i].prop;
    let nextProp = dates[i + 1].prop;
    if (
      (currProp == "end" && nextProp == "start") ||
      (currProp == nextProp &&
        dates[i].date.getTime() == dates[i + 1].date.getTime())
    )
      continue;
    // make new interval from 2 dates
    newIntervals.push({
      start: currProp == "end" ? addDays(dates[i].date, 1) : dates[i].date,
      end:
        nextProp === "start"
          ? addDays(dates[i + 1].date, -1)
          : dates[i + 1].date,
      zones: new Set<string>(),
      labels: new Set<string>(),
    });
  }
  return newIntervals;
}
function intervalSort(i1: Moment, i2: Moment) {
  let diff = i1.date.getTime() - i2.date.getTime();
  if (diff !== 0) return diff;
  else if (i1.prop == "start") return -1;
  else return 1;
}

export function vacanceToCalendarData(
  data: VacanceData,
  zoneColors: Map<string, Color>
) {
  let duration = nbOfDaysBetween(data.start, data.end);
  return {
    start: data.start,
    end: data.end,
    duration,
    label: duration != 1 ? data.zones.join(" + ") : "",
    info: data.labels.join("/") + " ⇒ " + data.zones.join(" + "),
    color: colorFromZones(data.zones, zoneColors),
    textColor: isDark(zoneColors.get(data.zones[0])!) ? "white" : "black",
  };
}
