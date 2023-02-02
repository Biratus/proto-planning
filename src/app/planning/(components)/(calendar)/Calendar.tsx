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
import { isFormateurMissing } from "@/lib/realData";
import { ModuleEvent, RawModule } from "@/lib/types";
import { AlertTriangle } from "react-feather";
import { useJoursFeries } from "./CalendarProvider";
const testMods = [
  {
    id: "34842f84-e21e-42cc-9fb4-c9c556c0be94",
    name: "AGILE SCRUM + SAFE",
    start: new Date(2023, 1, 6),
    end: new Date(2023, 1, 8),
    theme: "METHODES ET OUTILS",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Wallace",
      nom: "Wintheiser",
      mail: "Wintheiser88@yahoo.com",
    },
    duration: 3,
  },
  {
    id: "fad6ecd0-9b3e-4a6b-9375-6773a9c58cf8",
    name: "UNIX",
    start: new Date(2023, 1, 10),
    end: new Date(2023, 1, 10),
    theme: "FONDAMENTAUX ET BASE DE DONNEES",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Wallace",
      nom: "Wintheiser",
      mail: "Wintheiser88@yahoo.com",
    },
    duration: 1,
  },
  {
    id: "4",
    name: "MISS",
    start: new Date(2023, 1, 11),
    end: new Date(2023, 1, 12),
    theme: "FONDAMENTAUX ET BASE DE DONNEES",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      nom: "NA",
      prenom: "Na",
      mail: "na@na.na",
    },
    duration: 2,
  },
];

const testData = [
  {
    key: "filiere 1 Key",
    labelTitle: "Filiere 1 labelTitle",
    events: testMods,
  },
];

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
  const commonProps: CalendarProps<string, ModuleEvent> = {
    data: testData,
    LabelComponent: FiliereLabel,
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

function FiliereLabel({ labelKey }: { labelKey: string }) {
  return <>{labelKey}</>;
}
