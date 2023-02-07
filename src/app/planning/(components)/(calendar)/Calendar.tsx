"use client";
import {
  calendarDayStyle,
  missingFormateurStyle,
  overlapModuleStyle,
} from "@/components/calendar/styles";
import { CommonCalendarProps } from "@/components/calendar/types";
import { useLegendStore } from "@/components/legend/Legend";
import { useMonthNavigation } from "@/components/monthNavigation/MonthNavigationProvider";
import { useZoom } from "@/components/zoom/ZoomProvider";
import ZoomUI from "@/components/zoom/ZoomUI";
import { isFormateurMissing } from "@/lib/realData";
import { ModuleEvent, RawModule } from "@/lib/types";
import { useMemo } from "react";
import { AlertTriangle } from "react-feather";
import CalendarFiliere from "./CalendarFiliere";
import CalendarFormateur from "./CalendarFormateur";
import {
  openOverlapUI,
  useJoursFeries,
  usePopUpMenu,
} from "./CalendarProvider";
import { FiliereView, FormateurView } from "./CalendarView";

export default function CommonCalendar({
  modules,
  view,
  monthLength = 3,
}: {
  modules: RawModule[];
  view: string;
  monthLength?: number;
}) {
  const { isJoursFeries, getJourFerie } = useJoursFeries();

  const [month] = useMonthNavigation();
  const colorOf = useLegendStore((state) => state.colorOf);
  const zoom = useZoom((s) => s.value);
  const { open: openPopupMenu } = usePopUpMenu();

  // Props passed to Calendar
  const commonProps: CommonCalendarProps<ModuleEvent> = {
    zoom,
    time: { start: month, monthLength },
    event: {
      label: (mod: ModuleEvent) => {
        if (mod.overlap)
          return (
            <AlertTriangle
              color="red"
              className={mod.duration != 1 ? "ml-2" : ""}
            />
          );
        else return mod.duration == 1 ? "" : mod.name;
      },
      color: (mod: ModuleEvent) => colorOf(mod.theme),
      onClick: (mod, ref) => {
        if (mod.overlap) {
          openOverlapUI(mod, ref);
        } else openPopupMenu(mod, ref);
      },
      highlighted: (mod: ModuleEvent) =>
        isFormateurMissing(mod) || mod.overlap == true,
      highlightedProps: (mod: ModuleEvent) => {
        if (mod.overlap) return overlapModuleStyle;
        else if (isFormateurMissing(mod))
          return missingFormateurStyle(colorOf(mod.theme));
        else return { className: "" };
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
    commonDayStyle: calendarDayStyle,
  };

  const calendarFiliere = useMemo(
    () => <CalendarFiliere modules={modules} {...commonProps} />,
    [modules, month, zoom]
  );

  const calendarFormateur = useMemo(
    () => <CalendarFormateur modules={modules} {...commonProps} />,
    [modules, month, zoom]
  );

  // const days = eachDayOfInterval({ start: month, end: addMonths(month, 3) });

  return (
    <>
      <ZoomUI range={5} />
      {(!view || view === FiliereView.key) && calendarFiliere}
      {view === FormateurView.key && calendarFormateur}
    </>
  );
}
