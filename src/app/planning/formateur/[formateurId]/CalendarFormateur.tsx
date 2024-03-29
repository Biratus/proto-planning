"use client";

import { useLegendStore } from "@/components/legend/Legend";
import MonthNavigationUI from "@/components/monthNavigation/MonthNavigationUI";
import { useZoom } from "@/components/zoom/ZoomProvider";
import ZoomUI from "@/components/zoom/ZoomUI";
import { deserialize, nbOfDaysBetween } from "@/lib/date";
import { emptyStyle } from "@/lib/style";
import { Formateur, Module, SerializedModule } from "@/lib/types";
import CalendarSimple from "@/packages/calendar/SimpleView/CalendarSimple";
import { SerializedInterval } from "@/packages/calendar/types";
import { isWeekend, parseISO, startOfDay } from "date-fns";
import { useMemo } from "react";
import {
  calendarDayStyle,
  dayEventStyle,
  monthLabel,
} from "../../(components)/(calendar)/CalendarStyle";
import { FormateurView } from "../../(components)/(calendar)/CalendarView";
import GlobalViewLink from "../../(components)/GlobalViewLink";
import { useJoursFeries } from "../../(store)/specialDaysStore";

type CalendarFormateurProps = {
  formateur: Formateur;
  data: SerializedModule[];
  timeSpan: SerializedInterval;
};
function fromSerializedData(serializedData: SerializedModule[]) {
  return serializedData
    .map((m) => deserialize<Module>(m))
    .map((m) => ({ ...m, start: startOfDay(m.start), end: startOfDay(m.end) }));
}

export default function CalendarFormateur({
  formateur: { nom, prenom, mail },
  data,
  timeSpan: originalTimeSpan,
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

  // console.log({ formateurData });

  const colorOf = useLegendStore((state) => state.colorOf);
  const { zoom } = useZoom();
  const timeSpan = useMemo(
    () => ({
      start: parseISO(originalTimeSpan.start),
      end: parseISO(originalTimeSpan.end),
    }),
    [originalTimeSpan]
  );
  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-center">{`${nom} ${prenom} - [${mail}]`}</h2>
      <div className="flex w-1/2 flex-row justify-between">
        <GlobalViewLink view={FormateurView.key} />
        <ZoomUI range={5} />
      </div>
      <MonthNavigationUI />
      <CalendarSimple
        timeSpan={timeSpan}
        events={formateurData}
        zoom={zoom}
        eventProps={{
          label: (mod: Module) => mod.nom,
          style: (date: Date, mod?: Module) => {
            return mod
              ? dayEventStyle(date, mod, colorOf(mod.theme))
              : emptyStyle();
          },
          onClick: () => {
            console.log("Do something");
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
