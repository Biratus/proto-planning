"use client";
import { useLegendStore } from "@/components/legend/Legend";
import { useMonthNavigation } from "@/components/monthNavigation/MonthNavigationProvider";
import { useZoom } from "@/components/zoom/ZoomProvider";
import ZoomUI from "@/components/zoom/ZoomUI";
import { LocalStorageState } from "@/hooks/localStorageStore";
import { RawModule } from "@/lib/types";
import { addMonths } from "date-fns";
import { eachDayOfInterval } from "date-fns/esm";
import { useJoursFeries } from "./CalendarProvider";

export default function CommonCalendar({
  modules,
  view,
  monthLength = 3,
}: {
  modules: RawModule[];
  view?: any;
  monthLength?: number;
}) {
  const [isJoursFeries, getJourFeries] = useJoursFeries();

  const [month] = useMonthNavigation();
  const colorOf = useLegendStore((state) => state.colorOf);
  const zoom = useZoom((s: LocalStorageState<number>) => s.value);

  // Props passed to Calendar
  // const commonProps = {
  //   modules,
  //   zoom,
  //   time: { start: month, monthLength },
  //   event: {
  //     label: (mod: ModuleEvent) => {
  //       if (mod.overlap) return <AlertTriangle color="red" />;
  //       else return mod.duration == 1 ? "" : mod.name;
  //     },
  //     color: (mod: ModuleEvent) => colorOf(mod.theme),
  //     onClick: openMenu,
  //     highlighted: (mod: ModuleEvent) => isFormateurMissing(mod) || mod.overlap,
  //     highlightedProps: (mod: ModuleEvent) => {
  //       if (mod.overlap) return overlapModuleStyle;
  //       else if (isFormateurMissing(mod))
  //         return missingFormateurStyle(colorOf(mod.theme));
  //     },
  //   },
  //   day: {
  //     tooltip: {
  //       hasTooltip: isJoursFeries,
  //       tooltipInfo: getJourFeries,
  //     },
  //     styleProps: (date: Date, theme: string) => {
  //       let style = {
  //         ...calendarDayStyle(date),
  //       };
  //       if (isJoursFeries(date)) style.className = "red";
  //       return style;
  //     },
  //   },
  //   commonDayStyle: calendarDayStyle,
  // };

  //   const calendarFiliere = useMemo(
  //     () => <CalendarFiliere {...commonProps} />,
  //     [modules, month, zoom]
  //   );

  //   const calendarFormateur = useMemo(
  //     () => <CalendarFormateur {...commonProps} />,
  //     [modules, month, zoom]
  //   );

  const days = eachDayOfInterval({ start: month, end: addMonths(month, 3) });

  return (
    <>
      <ZoomUI range={5} />

      {/* {(!view || view === FiliereView.key) && calendarFiliere}
      {view && view === FormateurView.key && calendarFormateur} */}
    </>
  );
}
