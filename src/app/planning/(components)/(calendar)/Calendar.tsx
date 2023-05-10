"use client";
import Legend from "@/components/legend/Legend";
import LegendUI from "@/components/legend/LegendUI";
import { useZoom } from "@/components/zoom/ZoomProvider";
import {
  SerializedVacanceData,
  VacanceData,
  vacanceToCalendarData,
} from "@/lib/calendar/vacanceScolaire";
import { getGrayscaleForLabels } from "@/lib/colors";
import { apiUpdateModules } from "@/lib/dataAccess";
import { deserialize } from "@/lib/date";
import { Module, ModuleEvent, SerializedModule } from "@/lib/types";
import {
  CommonCalendarProps,
  SerializedInterval,
} from "@/packages/calendar/types";
import {
  areIntervalsOverlapping,
  compareAsc,
  parseISO,
  startOfDay,
} from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { AlertCircle } from "react-feather";
import DataDisplay from "../DataDisplay";
import History from "../History";
import UpdateDataUI from "../UpdateDataUI";
import CalendarFiliere from "./CalendarFiliere";
import CalendarFormateur from "./CalendarFormateur";
import { useSpecialDays } from "./CalendarProvider";
import { calendarDayStyle, monthLabel } from "./CalendarStyle";
import { FiliereView, FormateurView } from "./CalendarView";
import DayComponent from "./DayComponent";
import EventComponent from "./EventComponent";

const zonesVacances = ["Zone A", "Zone B", "Zone C"];
const zoneColors = getGrayscaleForLabels([...zonesVacances]);

function fromSerializedData(modules: SerializedModule[]) {
  return modules
    .map((m) => deserialize<Module>(m))
    .map((m) => ({ ...m, start: startOfDay(m.start), end: startOfDay(m.end) }));
}

export default function CommonCalendar({
  data: serializedData,
  view = FiliereView.key,
  timeSpan: originalTimeSpan,
  vacancesScolaire,
}: {
  data: SerializedModule[];
  view?: string;
  timeSpan: SerializedInterval;
  vacancesScolaire: SerializedVacanceData[];
}) {
  const router = useRouter();
  const { isJoursFeries, getJourFerie } = useSpecialDays();

  const vacanceData = useMemo(() => {
    const vacanceData = vacancesScolaire.map((vd) =>
      deserialize<VacanceData>(vd)
    );
    vacanceData.sort((v1, v2) => compareAsc(v1.start, v2.start));
    return vacanceData;
  }, [vacancesScolaire]);

  const { zoom } = useZoom();

  const [tempData, setTempData] = useState<Map<number, Module>>(new Map());
  const originalTempData = useMemo(() => {
    return new Map(
      serializedData
        .filter((m) => tempData.has(m.id))
        .map((m) => [m.id, deserialize<Module>(m)])
    );
  }, [serializedData, tempData]);

  const timeSpan = useMemo(
    () => ({
      start: parseISO(originalTimeSpan.start),
      end: parseISO(originalTimeSpan.end),
    }),
    [originalTimeSpan]
  );

  const calendarData = useMemo<Module[]>(() => {
    const calendarData = fromSerializedData(serializedData);
    for (let [id, mod] of tempData) {
      let index = calendarData.findIndex((m) => m.id == id);
      calendarData[index] = {
        ...calendarData[index],
        ...mod,
      };
    }
    return calendarData;
  }, [serializedData, tempData]);

  // console.log("CommonCalendar", { calendarData, serializedData });

  const isModifying = useRef(false);

  const dayHeader = useMemo(
    () =>
      vacanceData
        .filter((v) =>
          areIntervalsOverlapping(v, timeSpan, { inclusive: true })
        )
        .map((v) => vacanceToCalendarData(v, zoneColors)),
    [vacanceData, timeSpan]
  );

  const commonProps: CommonCalendarProps<ModuleEvent> = useMemo(
    () => ({
      zoom,
      timeSpan,
      event: EventComponent,
      monthLabelStyle: monthLabel,
      daysHeader: dayHeader,
      day: DayComponent,
      dayStyle: (date: Date) => {
        let style = {
          ...calendarDayStyle(date),
        };
        if (isJoursFeries(date)) style.className = "text-red-600";
        return style;
      },
    }),
    [zoom, timeSpan, dayHeader]
  );

  const updateCalendarData = (newModules: Module[]) => {
    isModifying.current = true;
    setTempData((prevModules) => {
      const map = new Map(prevModules);

      for (let mod of newModules) map.set(mod.id, mod);
      return map;
    });
  };

  const calendarFiliere = useMemo(
    () => (
      <CalendarFiliere
        modules={calendarData}
        updateModules={updateCalendarData}
        {...commonProps}
      />
    ),
    [calendarData, commonProps]
  );

  const calendarFormateur = useMemo(
    () => (
      <CalendarFormateur
        modules={calendarData}
        updateModules={updateCalendarData}
        {...commonProps}
      />
    ),
    [calendarData, commonProps]
  );

  const updateData = useCallback(async () => {
    try {
      const response = await apiUpdateModules(Array.from(tempData.values()));

      if (response.errors.length > 0) {
        for (let error of response.errors) {
          console.error(error);
        }
      } else {
        router.refresh();
      }
    } catch (e) {}

    isModifying.current = false;
  }, [tempData, router]);

  const cancelModification = useCallback((modId?: number) => {
    if (modId) {
      setTempData((prevModules) => {
        prevModules.delete(modId);
        const map = new Map(prevModules);
        return map;
      });
    } else {
      setTempData(new Map());
      isModifying.current = false;
    }
  }, []);

  return (
    <>
      <div>
        <DataDisplay />

        {isModifying.current && (
          <UpdateDataUI
            originalData={originalTempData}
            tempData={tempData}
            modify={updateData}
            abort={cancelModification}
          />
        )}
        <div className="my-2 flex gap-2">
          <div className="dropdown">
            <label tabIndex={0} className="btn-ghost btn gap-2 text-info">
              <span>Aide</span>
              <AlertCircle color="blue" />
            </label>
            <div
              tabIndex={0}
              className="card dropdown-content rounded-box w-[600px] border border-base-300 bg-base-100 shadow-lg"
            >
              <div className="card-body">
                <h2 className="card-title">
                  Aide sur l&apos;outil de planning
                </h2>
                <p>
                  Naviguer dans le planning: <kbd className="kbd">shift</kbd> +{" "}
                  <kbd className="kbd">molette</kbd>
                </p>
                <p>
                  Vous pouvez cliquer sur les filières/formateurs et déplacer
                  les modules à l&apos;aide de la souris
                </p>
                <LegendUI
                  title="Vacances scolaire"
                  legendList={Array.from(zoneColors.keys()).map((t) => ({
                    label: t,
                    style: {
                      className: "",
                      props: {
                        backgroundColor: zoneColors.get(t)!.rgb,
                      },
                    },
                  }))}
                />
                <Legend />
              </div>
            </div>
          </div>
          <History refreshData={() => router.refresh()} />
        </div>
      </div>
      {view === FiliereView.key && calendarFiliere}
      {view === FormateurView.key && calendarFormateur}
    </>
  );
}
