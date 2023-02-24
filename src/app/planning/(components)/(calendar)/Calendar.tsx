"use client";
import { useLegendStore } from "@/components/legend/Legend";
import { useMonthNavigation } from "@/components/monthNavigation/MonthNavigationProvider";
import { useZoom } from "@/components/zoom/ZoomProvider";
import { isFormateurMissing } from "@/lib/realData";
import { mergeStyle } from "@/lib/style";
import { ModuleEvent, RawModule } from "@/lib/types";
import {
  CalendarEventComponentProps,
  CommonCalendarProps,
} from "@/packages/calendar/types";
import { useMemo, useState } from "react";
import { AlertTriangle } from "react-feather";
import { ModuleDetailModalId } from "../(hover)/(modals)/ModuleModal";
import CalendarFiliere from "./CalendarFiliere";
import CalendarFormateur from "./CalendarFormateur";
import {
  openOverlapUI,
  setFocusModule,
  useJoursFeries,
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
  { label: "Module", print: (mod: ModuleEvent) => mod.name },
  {
    label: "Filière",
    print: (mod: ModuleEvent) => mod.filiere,
    for: FormateurView.key,
  },
  {
    label: "Formateur",
    print: (mod: ModuleEvent) => mod.formateur.nom + " " + mod.formateur.prenom,
    for: FiliereView.key,
  },
];

export default function CommonCalendar({
  modules,
  view = FiliereView.key,
  monthLength = 3,
}: {
  modules: RawModule[];
  view?: string;
  monthLength?: number;
}) {
  const { isJoursFeries, getJourFerie } = useJoursFeries();

  const [month] = useMonthNavigation();
  const colorOf = useLegendStore((state) => state.colorOf);
  const { zoom } = useZoom();
  const [eventLabel, setEventLabel] = useState<DisplayView>(displayViews[0]);

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
          onClick: (mod, ref) => {
            if (mod.overlap) {
              openOverlapUI(mod, ref);
            } else setFocusModule(mod);
          },
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
            hasTooltip: isJoursFeries,
            tooltipInfo: getJourFerie,
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
      }),
      [zoom, month, monthLength, eventLabel]
    );

  const calendarFiliere = useMemo(
    () => <CalendarFiliere modules={modules} {...commonProps} />,
    [modules, month, zoom, commonProps]
  );

  const calendarFormateur = useMemo(
    () => <CalendarFormateur modules={modules} {...commonProps} />,
    [modules, month, zoom, commonProps]
  );

  return (
    <>
      <div className="flex gap-2">
        <span>Affichage: </span>
        {displayViews
          .filter((v) => !v.for || v.for == view)
          .map((v) => (
            <button
              key={v.label}
              className={`btn-xs btn ${v == eventLabel ? `btn-primary` : ""}`}
              onClick={() => setEventLabel(v)}
            >
              {v.label}
            </button>
          ))}
      </div>
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
    <label htmlFor={ModuleDetailModalId} className="px-1" {...props}>
      {mod!.overlap ? (
        <AlertTriangle
          color="red"
          className={mod!.duration != 1 ? "ml-2" : ""}
        />
      ) : (
        children
      )}
    </label>
  );
}
