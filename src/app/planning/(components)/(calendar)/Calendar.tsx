"use client";
import {
  calendarDayStyle,
  eventStyle,
  mergeStyle,
  missingFormateurStyle,
  overlapModuleStyle,
} from "@/components/calendar/styles";
import { CommonCalendarProps } from "@/components/calendar/types";
import { useLegendStore } from "@/components/legend/Legend";
import { useMonthNavigation } from "@/components/monthNavigation/MonthNavigationProvider";
import { useZoom } from "@/components/zoom/ZoomProvider";
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
  const { open: openPopupMenu } = usePopUpMenu();

  // Props passed to Calendar
  const commonProps: CommonCalendarProps<ModuleEvent> = useMemo(
    () => ({
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
        onClick: (mod, ref) => {
          if (mod.overlap) {
            openOverlapUI(mod, ref);
          } else openPopupMenu(mod, ref);
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
    }),
    [zoom, month, monthLength]
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
      {view === FiliereView.key && calendarFiliere}
      {view === FormateurView.key && calendarFormateur}
    </>
  );
}
