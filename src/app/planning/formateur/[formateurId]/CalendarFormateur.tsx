"use client";

import CalendarSimple from "@/components/calendar/SimpleView/CalendarSimple";
import {
  calendarDayStyle,
  dayEventStyle,
  emptyStyle,
} from "@/components/calendar/styles";
import { useLegendStore } from "@/components/legend/Legend";
import { useMonthNavigation } from "@/components/monthNavigation/MonthNavigationProvider";
import MonthNavigationUI from "@/components/monthNavigation/MonthNavigationUI";
import { useZoom } from "@/components/zoom/ZoomProvider";
import ZoomUI from "@/components/zoom/ZoomUI";
import { mapISO } from "@/lib/date";
import { Formateur, ModuleEvent, RawModule } from "@/lib/types";
import { isWeekend } from "date-fns";
import { useMemo } from "react";
import { useJoursFeries } from "../../(components)/(calendar)/CalendarProvider";
import GlobalViewLink from "../../(components)/GlobalViewLink";

const viewWidth = 50;

type CalendarFormateurProps = {
  formateur: Formateur;
  data: RawModule[];
};

export default function CalendarFormateur({
  formateur: { nom, prenom, mail },
  data,
}: CalendarFormateurProps) {
  const formateurData = useMemo(
    () => mapISO<ModuleEvent>(data, ["start", "end"]),
    [data]
  );
  const { isJoursFeries, getJourFerie } = useJoursFeries();
  //   const {openMenu} = useCalendarMenu();
  const [month] = useMonthNavigation();
  const colorOf = useLegendStore((state) => state.colorOf);
  const zoom = useZoom((s) => s.value);

  return (
    <div className="flex flex-col gap-2 items-center">
      <h2 className="text-center">{`${nom} ${prenom} - [${mail}]`}</h2>
      <div className="flex flex-row justify-between w-1/2">
        <GlobalViewLink />
        <ZoomUI range={5} />
      </div>
      <MonthNavigationUI />
      <CalendarSimple
        time={{ start: month, monthLength: 3 }}
        events={formateurData}
        zoom={zoom}
        eventProps={{
          label: (mod: ModuleEvent) => mod.name,
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
      />
    </div>
  );
}
