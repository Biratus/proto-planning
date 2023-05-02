"use client";
import { useLegendStore } from "@/components/legend/Legend";
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
import { isFormateurMissing } from "@/lib/realData";
import { mergeStyle } from "@/lib/style";
import { Module, ModuleEvent, SerializedModule } from "@/lib/types";
import {
  CalendarEventComponentProps,
  CommonCalendarProps,
  SerializedInterval,
} from "@/packages/calendar/types";
import cn from "classnames";
import {
  areIntervalsOverlapping,
  compareAsc,
  parseISO,
  startOfDay,
} from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { AlertTriangle } from "react-feather";
import { ModuleDetailModalId } from "../(hover)/(modals)/ModuleModal";
import { overlayID } from "../(hover)/OverlapModuleOverlay";
import DataDisplay, { DisplayView } from "../DataDisplay";
import History from "../History";
import UpdateDataUI from "../UpdateDataUI";
import CalendarFiliere from "./CalendarFiliere";
import CalendarFormateur from "./CalendarFormateur";
import {
  openOverlapUI,
  setFocusModule,
  useSpecialDays,
} from "./CalendarProvider";
import {
  calendarDayStyle,
  eventStyle,
  missingFormateurStyle,
  monthLabel,
  overlapModuleStyle,
} from "./CalendarStyle";
import { FiliereView, FormateurView } from "./CalendarView";
const displayViews: DisplayView[] = [
  {
    label: "Module",
    print: (mod: ModuleEvent) => mod.nom,
    disabled: false,
    selected: false,
  },
  {
    label: "Filière",
    print: (mod: ModuleEvent) => mod.filiere!.nom,
    for: FormateurView.key,
    disabled: false,
    selected: false,
  },
  {
    label: "Formateur",
    print: (mod: ModuleEvent) =>
      mod.formateur!.nom + " " + mod.formateur!.prenom,
    for: FiliereView.key,
    disabled: false,
    selected: false,
  },
];
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

  const colorOf = useLegendStore((state) => state.colorOf);
  const { zoom } = useZoom();
  const [eventLabel, setEventLabel] = useState<DisplayView>(displayViews[0]);

  const [tempData, setTempData] = useState<Map<number, Module>>(new Map());
  const originalTempData = useMemo(() => {
    return new Map(
      serializedData
        .filter((m) => tempData.has(m.id))
        .map((m) => [m.id, deserialize<Module>(m)])
    );
  }, [tempData]);

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

  console.log("CommonCalendar", { calendarData, serializedData });

  const isModifying = useRef(false);

  // Props passed to Calendar
  const eventProps = useMemo(
    () => ({
      as: EventComponent,
      label: (mod: ModuleEvent) =>
        mod.duration == 1 ? "" : eventLabel.print(mod),
      onClick: eventOnClick,
      style: (mod: ModuleEvent) => {
        let style = eventStyle(colorOf(mod.theme));
        if (mod.overlap) {
          style = mergeStyle(style, overlapModuleStyle);
        } else if (isFormateurMissing(mod)) {
          style = mergeStyle(style, missingFormateurStyle(colorOf(mod.theme)));
        }
        return style;
      },
    }),
    [eventLabel, colorOf]
  );

  const dayProps = useMemo(
    () => ({
      tooltip: {
        hasTooltip: (d: Date) => isJoursFeries(d),
        tooltipInfo: (d: Date) => {
          if (isJoursFeries(d)) return getJourFerie(d);
        },
      },
      styleProps: (date: Date) => {
        let style = {
          ...calendarDayStyle(date),
        };
        if (isJoursFeries(date)) style.className = "text-red-600";
        return style;
      },
    }),
    [isJoursFeries, getJourFerie]
  );

  const dayHeader = useMemo(
    () =>
      vacanceData
        .filter((v) =>
          areIntervalsOverlapping(v, timeSpan, { inclusive: true })
        )
        .map((v) => vacanceToCalendarData(v, zoneColors)),
    [vacanceData, timeSpan]
  );

  const commonProps: CommonCalendarProps<ModuleEvent, typeof EventComponent> =
    useMemo(
      () => ({
        zoom,
        timeSpan,
        event: eventProps,
        day: dayProps,
        monthLabelStyle: monthLabel,
        daysHeader: dayHeader,
      }),
      [zoom, timeSpan, dayHeader, eventProps, dayProps]
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
  }, [tempData]);

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
        <DataDisplay
          views={displayViews.map((v) => ({
            ...v,
            disabled: Boolean(v.for) && v.for != view,
            selected: v.label == eventLabel.label,
          }))}
          setSelected={setEventLabel}
        />
        <div>
          <LegendUI
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
        </div>
      </div>
      {isModifying.current && (
        <UpdateDataUI
          originalData={originalTempData}
          tempData={tempData}
          modify={updateData}
          abort={cancelModification}
        />
      )}
      <History refreshData={() => router.refresh()} />
      {view === FiliereView.key && calendarFiliere}
      {view === FormateurView.key && calendarFormateur}
    </>
  );
}

function EventComponent({
  event: mod,
  children,
  ...props
}: CalendarEventComponentProps<ModuleEvent>) {
  return (
    <label
      htmlFor={mod!.overlap ? overlayID : ModuleDetailModalId}
      {...props}
      className={`pl-1 ${props.className}`}
    >
      {mod!.overlap ? (
        <AlertTriangle
          color="red"
          className={cn({ "ml-2": mod!.duration != 1 })}
        />
      ) : (
        children
      )}
    </label>
  );
}

// Utils for common props
function eventOnClick(mod: ModuleEvent, ref: HTMLElement) {
  if (mod.overlap) {
    openOverlapUI(mod, ref);
  } else setFocusModule(mod);
}
