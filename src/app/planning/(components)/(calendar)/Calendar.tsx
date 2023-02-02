"use client";
import FullCalendar from "@/components/calendar/fullCalendar/FullCalendar";
import {
  calendarDayStyle,
  missingFormateurStyle,
  overlapModuleStyle,
} from "@/components/calendar/styles";
import { CalendarProps } from "@/components/calendar/types";
import { useLegendStore } from "@/components/legend/Legend";
import { useMonthNavigation } from "@/components/monthNavigation/MonthNavigationProvider";
import { useZoom } from "@/components/zoom/ZoomProvider";
import ZoomUI from "@/components/zoom/ZoomUI";
import { LocalStorageState } from "@/hooks/localStorageStore";
import { toCalendarData } from "@/lib/calendar";
import { isFormateurMissing } from "@/lib/realData";
import { Formateur, ModuleEvent, RawModule } from "@/lib/types";
import { AlertTriangle } from "react-feather";
import { useJoursFeries } from "./CalendarProvider";
import { FormateurView } from "./CalendarView";

export default function CommonCalendar({
  modules,
  view,
  monthLength = 3,
}: {
  modules: RawModule[];
  view?: string;
  monthLength?: number;
}) {
  const { isJoursFeries, getJourFerie } = useJoursFeries();

  const [month] = useMonthNavigation();
  const colorOf = useLegendStore((state) => state.colorOf);
  const zoom = useZoom((s: LocalStorageState<number>) => s.value);

  // Props passed to Calendar
  const commonProps: CalendarProps<Formateur, ModuleEvent> = {
    data: toCalendarData(modules, "formateur.mail", FormateurView),
    LabelComponent: FormateurView.LabelComponent,
    zoom,
    time: { start: month, monthLength },
    event: {
      label: (mod: ModuleEvent) => {
        if (mod.overlap) return <AlertTriangle color="red" />;
        else return mod.duration == 1 ? "" : mod.name;
      },
      color: (mod: ModuleEvent) => colorOf(mod.theme),
      onClick: (event: ModuleEvent, target: HTMLElement) => {
        console.log("TODO", event);
      }, //openMenu,
      highlighted: (mod: ModuleEvent) => {
        if (isFormateurMissing(mod)) return true;
        else if ("overlap" in mod && mod.overlap) return true;
        else return false;
      },
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
        if (isJoursFeries(date)) style.className = "red";
        return style;
      },
    },
    commonDayStyle: calendarDayStyle,
  };

  //   const calendarFiliere = useMemo(
  //     () => <CalendarFiliere {...commonProps} />,
  //     [modules, month, zoom]
  //   );

  //   const calendarFormateur = useMemo(
  //     () => <CalendarFormateur {...commonProps} />,
  //     [modules, month, zoom]
  //   );

  // const days = eachDayOfInterval({ start: month, end: addMonths(month, 3) });

  return (
    <>
      <ZoomUI range={5} />
      <FullCalendar {...commonProps} />
      {/* {(!view || view === FiliereView.key) && calendarFiliere}
      {view && view === FormateurView.key && calendarFormateur} */}
    </>
  );
}
