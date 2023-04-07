"use client";
import { useLegendStore } from "@/components/legend/Legend";
import LegendUI from "@/components/legend/LegendUI";
import { useMonthNavigation } from "@/components/monthNavigation/MonthNavigationProvider";
import { useZoom } from "@/components/zoom/ZoomProvider";
import {
  SerializedVacanceData,
  VacanceData,
} from "@/lib/calendar/vacanceScolaire";
import { colorFromZones, getGrayscaleForLabels, isDark } from "@/lib/colors";
import { mapISO } from "@/lib/date";
import { isFormateurMissing } from "@/lib/realData";
import { mergeStyle } from "@/lib/style";
import {
  Filiere,
  FormateurWithModule,
  FormateurWithSerializedModule,
  Module,
  ModuleEvent,
  SerializedFiliere,
} from "@/lib/types";
import {
  CalendarEventComponentProps,
  CommonCalendarProps,
} from "@/packages/calendar/types";
import { nbOfDaysBetween } from "@/packages/calendar/utils";
import cn from "classnames";
import {
  addMonths,
  areIntervalsOverlapping,
  compareAsc,
  endOfMonth,
  startOfDay,
} from "date-fns";
import { useCallback, useMemo, useRef, useState } from "react";
import { AlertTriangle } from "react-feather";
import { ModuleDetailModalId } from "../(hover)/(modals)/ModuleModal";
import { overlayID } from "../(hover)/OverlapModuleOverlay";
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

type DisplayView = {
  label: string;
  print: (mod: ModuleEvent) => string;
  for?: string;
};

const displayViews: DisplayView[] = [
  { label: "Module", print: (mod: ModuleEvent) => mod.nom },
  {
    label: "Filière",
    print: (mod: ModuleEvent) => mod.filiere!.nom,
    for: FormateurView.key,
  },
  {
    label: "Formateur",
    print: (mod: ModuleEvent) =>
      mod.formateur!.nom + " " + mod.formateur!.prenom,
    for: FiliereView.key,
  },
];

const zonesVacances = ["Zone A", "Zone B", "Zone C"];
const zoneColors = getGrayscaleForLabels([...zonesVacances]);

function fromSerializedData(
  serializedData: SerializedFiliere[] | FormateurWithSerializedModule[]
) {
  return serializedData.map((d) => ({
    ...d,
    modules: d.modules
      ? mapISO<Module>(d.modules, ["start", "end"], (raw, parsed) =>
          startOfDay(parsed)
        )
      : [],
  }));
}

export default function CommonCalendar({
  data: serializedData,
  view = FiliereView.key,
  monthLength = 3,
  vacancesScolaire,
}: {
  data: SerializedFiliere[] | FormateurWithSerializedModule[];
  view?: string;
  monthLength?: number;
  vacancesScolaire: SerializedVacanceData[];
}) {
  const { isJoursFeries, getJourFerie } = useSpecialDays();

  const vacanceData = mapISO<VacanceData>(vacancesScolaire, ["start", "end"]);
  vacanceData.sort((v1, v2) => compareAsc(v1.start, v2.start));

  const [month] = useMonthNavigation();
  const colorOf = useLegendStore((state) => state.colorOf);
  const { zoom } = useZoom();
  const [eventLabel, setEventLabel] = useState<DisplayView>(displayViews[0]);
  const [calendarData, setCalendarData] = useState<
    Filiere[] | FormateurWithModule[]
  >(fromSerializedData(serializedData));

  console.log("CommonCalendar", { calendarData, serializedData });

  const isModifying = useRef(false);
  // const data: Filiere[] | FormateurWithModule[] = useMemo(
  //   () =>
  //     serializedData.map((d) => ({
  //       ...d,
  //       modules: mapISO<Module>(d.modules, ["start", "end"]),
  //     })),
  //   [serializedData]
  // );
  // Props passed to Calendar
  const commonProps: CommonCalendarProps<ModuleEvent, typeof EventComponent> =
    useMemo(
      () => ({
        zoom,
        time: { start: month, monthLength },
        event: {
          as: EventComponent,
          label: (mod: ModuleEvent) =>
            mod.duration == 1 ? "" : eventLabel.print(mod),
          onClick: eventOnClick,
          style: (mod: ModuleEvent) => {
            let style = eventStyle(colorOf(mod.theme));
            if (mod.overlap) {
              style = mergeStyle(style, overlapModuleStyle);
            } else if (isFormateurMissing(mod)) {
              style = mergeStyle(
                style,
                missingFormateurStyle(colorOf(mod.theme))
              );
            }
            return style;
          },
        },
        day: {
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
        },
        monthLabelStyle: monthLabel,
        daysHeader: vacanceData
          .filter((v) =>
            areIntervalsOverlapping(
              v,
              {
                start: month,
                end: endOfMonth(addMonths(month, monthLength - 1)),
              },
              { inclusive: true }
            )
          )
          .map((v) => {
            let duration = nbOfDaysBetween(v.start, v.end);
            return {
              start: v.start,
              end: v.end,
              duration,
              label: duration != 1 ? v.zones.join(" + ") : "",
              info: v.labels.join("/") + " ⇒ " + v.zones.join(" + "),
              color: colorFromZones(v.zones, zoneColors),
              textColor: isDark(zoneColors.get(v.zones[0])!)
                ? "white"
                : "black",
            };
          }),
      }),
      [zoom, month, monthLength, eventLabel, zoneColors]
    );

  const dataRefresh = useCallback(() => {
    isModifying.current = true;
    setCalendarData([...calendarData]);
  }, [calendarData]);

  const calendarFiliere = useMemo(
    () => (
      <CalendarFiliere
        filieres={calendarData as Filiere[]}
        dataRefresh={dataRefresh}
        {...commonProps}
      />
    ),
    [calendarData, commonProps]
  );

  const calendarFormateur = useMemo(
    () => (
      <CalendarFormateur
        formateurs={calendarData as FormateurWithModule[]}
        dataRefresh={dataRefresh}
        {...commonProps}
      />
    ),
    [calendarData, commonProps]
  );

  const updateData = useCallback(() => {
    console.log("updateData");
    isModifying.current = false;
    // Test update
    // if true
  }, [calendarData]);

  const cancelModification = useCallback(() => {
    isModifying.current = false;
    setCalendarData(fromSerializedData(serializedData));
  }, []);

  return (
    <>
      <div>
        <div className="mb-3 border-b border-primary text-xl text-primary">
          Affichage
        </div>
        <div className="flex gap-2 pl-3">
          {displayViews.map((v) => {
            let dis = Boolean(v.for) && v.for != view;
            return (
              <button
                key={v.label}
                className={cn({
                  "btn-xs btn": true,
                  "btn-primary": v == eventLabel,
                  "btn-disabled": dis,
                })}
                onClick={() => setEventLabel(v)}
                disabled={dis}
              >
                {v.label}
              </button>
            );
          })}
        </div>
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
        <UpdateDataUI modify={updateData} abort={cancelModification} />
      )}
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

function UpdateDataUI({
  modify,
  abort,
}: {
  modify: () => void;
  abort: () => void;
}) {
  return (
    <div className="space-x-4">
      <button className="btn-success btn" onClick={modify}>
        Enregistrer les modifications
      </button>
      <button className="btn-error btn" onClick={abort}>
        Annuler
      </button>
    </div>
  );
}

// Utils for common props
function eventOnClick(mod: ModuleEvent, ref: HTMLElement) {
  if (mod.overlap) {
    openOverlapUI(mod, ref);
  } else setFocusModule(mod);
}
