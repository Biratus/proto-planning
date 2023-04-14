"use client";
import { useLegendStore } from "@/components/legend/Legend";
import LegendUI from "@/components/legend/LegendUI";
import { useMonthNavigation } from "@/components/monthNavigation/MonthNavigationProvider";
import { useZoom } from "@/components/zoom/ZoomProvider";
import {
  SerializedVacanceData,
  VacanceData,
  vacanceToCalendarData,
} from "@/lib/calendar/vacanceScolaire";
import { getGrayscaleForLabels } from "@/lib/colors";
import { mapISO } from "@/lib/date";
import { isFormateurMissing } from "@/lib/realData";
import { mergeStyle } from "@/lib/style";
import { Module, ModuleEvent, SerializedModule } from "@/lib/types";
import {
  CalendarEventComponentProps,
  CommonCalendarProps,
} from "@/packages/calendar/types";
import cn from "classnames";
import {
  addMonths,
  areIntervalsOverlapping,
  compareAsc,
  endOfMonth,
} from "date-fns";
import { useCallback, useMemo, useRef, useState } from "react";
import { AlertTriangle } from "react-feather";
import { ModuleDetailModalId } from "../(hover)/(modals)/ModuleModal";
import { overlayID } from "../(hover)/OverlapModuleOverlay";
import DataDisplay, { DisplayView } from "../DataDisplay";
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

// function fromSerializedData(
//   serializedData: SerializedFiliere[] | FormateurWithSerializedModule[]
// ) {
//   return serializedData.map((d) => ({
//     ...d,
//     modules: d.modules
//       ? mapISO<Module>(d.modules, ["start", "end"], (raw, parsed) =>
//           startOfDay(parsed)
//         )
//       : [],
//   }));
// }
function fromSerializedData(modules: SerializedModule[]) {
  return mapISO<Module>(modules, ["start", "end"]);
}

export default function CommonCalendar({
  data: serializedData,
  view = FiliereView.key,
  monthLength = 3,
  vacancesScolaire,
}: {
  data: SerializedModule[];
  view?: string;
  monthLength?: number;
  vacancesScolaire: SerializedVacanceData[];
}) {
  const { isJoursFeries, getJourFerie } = useSpecialDays();

  const vacanceData = useMemo(() => {
    const vacanceData = mapISO<VacanceData>(vacancesScolaire, ["start", "end"]);
    vacanceData.sort((v1, v2) => compareAsc(v1.start, v2.start));
    return vacanceData;
  }, []);

  const [month] = useMonthNavigation();
  const colorOf = useLegendStore((state) => state.colorOf);
  const { zoom } = useZoom();
  const [eventLabel, setEventLabel] = useState<DisplayView>(displayViews[0]);

  const [stateData, setStateData] = useState<Module[]>([]);

  const calendarData = useMemo<Module[]>(() => {
    const calendarData = fromSerializedData(serializedData);
    for (let module of stateData) {
      let index = calendarData.findIndex((m) => m.id == module.id);
      calendarData[index] = {
        ...calendarData[index],
        ...module,
      };
    }
    return calendarData;
  }, [serializedData, stateData]);

  // const [calendarData, setCalendarData] = useState<
  //   Filiere[] | FormateurWithModule[]
  // >(fromSerializedData(serializedData));

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
    [eventLabel]
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
          areIntervalsOverlapping(
            v,
            {
              start: month,
              end: endOfMonth(addMonths(month, monthLength - 1)),
            },
            { inclusive: true }
          )
        )
        .map((v) => vacanceToCalendarData(v, zoneColors)),
    [vacanceData, month, monthLength]
  );

  const commonProps: CommonCalendarProps<ModuleEvent, typeof EventComponent> =
    useMemo(
      () => ({
        zoom,
        time: { start: month, monthLength },
        event: eventProps,
        day: dayProps,
        monthLabelStyle: monthLabel,
        daysHeader: dayHeader,
      }),
      [zoom, month, monthLength, dayHeader, eventProps, zoneColors, dayProps]
    );

  const dataRefresh = useCallback(() => {
    isModifying.current = true;
    // setCalendarData([...calendarData]);
  }, [calendarData]);

  const updateCalendarData = (newModules: Module[]) => {
    isModifying.current = true;
    setStateData((prevModules) => [...prevModules, ...newModules]);
  };

  const calendarFiliere = useMemo(
    () => (
      <CalendarFiliere
        modules={calendarData}
        updateModules={updateCalendarData}
        // dataRefresh={dataRefresh}
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
        // dataRefresh={dataRefresh}
        {...commonProps}
      />
    ),
    [calendarData, commonProps]
  );

  const updateData = useCallback(() => {
    console.log("TODO updateData");
    isModifying.current = false;
    // Test update
    // if true
  }, [calendarData]);

  const cancelModification = useCallback(() => {
    isModifying.current = false;
    setStateData([]);
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
