"use client";

import { useLegendStore } from "@/components/legend/Legend";
import { useMonthNavigation } from "@/components/monthNavigation/MonthNavigationProvider";
import MonthNavigationUI from "@/components/monthNavigation/MonthNavigationUI";
import { useZoom } from "@/components/zoom/ZoomProvider";
import ZoomUI from "@/components/zoom/ZoomUI";
import { mapISO, nbOfDaysBetween } from "@/lib/date";
import { emptyStyle } from "@/lib/style";
import { Formateur, Module, ModuleEvent, SerializedModule } from "@/lib/types";
import CalendarSimple from "@/packages/calendar/SimpleView/CalendarSimple";
import { isWeekend, startOfDay } from "date-fns";
import { useMemo } from "react";
import { useJoursFeries } from "../../(components)/(calendar)/CalendarProvider";
import {
  calendarDayStyle,
  dayEventStyle,
  monthLabel,
} from "../../(components)/(calendar)/CalendarStyle";
import { FormateurView } from "../../(components)/(calendar)/CalendarView";
import GlobalViewLink from "../../(components)/GlobalViewLink";

type CalendarFormateurProps = {
  formateur: Formateur;
  data: SerializedModule[];
};
function fromSerializedData(serializedData: SerializedModule[]) {
  return mapISO<Module>(serializedData, ["start", "end"], (raw, parsed) =>
    startOfDay(parsed)
  );
}

export default function CalendarFormateur({
  formateur: { nom, prenom, mail },
  data,
}: CalendarFormateurProps) {
  const formateurData = useMemo(
    () =>
      fromSerializedData(data).map((d) => ({
        ...d,
        duration: nbOfDaysBetween(d.start, d.end),
      })),
    [data]
  );
  const { isJoursFeries, getJourFerie } = useJoursFeries();
  //   const {openMenu} = useCalendarMenu();
  const [month] = useMonthNavigation();
  const colorOf = useLegendStore((state) => state.colorOf);
  const { zoom } = useZoom();

  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-center">{`${nom} ${prenom} - [${mail}]`}</h2>
      <div className="flex w-1/2 flex-row justify-between">
        <GlobalViewLink view={FormateurView.key} />
        <ZoomUI range={5} />
      </div>
      <MonthNavigationUI />
      <CalendarSimple
        time={{ start: month, monthLength: 3 }}
        events={formateurData}
        zoom={zoom}
        eventProps={{
          label: (mod: ModuleEvent) => mod.nom,
          style: (date: Date, mod?: ModuleEvent) => {
            return mod
              ? dayEventStyle(date, mod, colorOf(mod.theme))
              : emptyStyle();
          },
          onClick: () => {
            console.log("Do something");
            //openMenu,
          },
        }}
        dayProps={{
          tooltip: {
            hasTooltip: isJoursFeries,
            tooltipInfo: getJourFerie,
          },
          styleProps: (date: Date) => {
            let style = {
              ...calendarDayStyle(date),
            };
            if (isJoursFeries(date)) style.className += " text-red-500";
            else if (isWeekend(date)) style.className += " text-white";
            return style;
          },
        }}
        monthLabelStyle={monthLabel}
      />
    </div>
  );
}
