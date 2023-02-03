import { formatMonthYear, nbOfDaysBetween } from "@/lib/date";
import { isSameMonth } from "date-fns";
import { useMemo } from "react";
import { CalendarDetailProps, Interval } from "../types";
import CalendarRow from "./CalendarRow";

export default function CalendarDetail<T extends Interval>({
  style,
  events,
  cellHeight,
  additionalLabel,
  AdditionalInfo,
  context,
}: CalendarDetailProps<T>) {
  const dayNb = events.reduce(
    (acc, { start, end }) => acc + nbOfDaysBetween(start, end),
    0
  );

  const eventsUI = useMemo(() => {
    let eventsComp = [];
    let currMonth = events[0].start;
    let currIndexToAdd = 0;
    let currDayCumul = 0;
    let monthAdded = 0;

    for (let i in events) {
      let event = events[i];
      if (!isSameMonth(currMonth, event.end)) {
        let span = currDayCumul;
        if (event == events[events.length - 1])
          span += nbOfDaysBetween(event.start, event.end);
        eventsComp.splice(
          currIndexToAdd,
          0,
          <Month
            name={formatMonthYear(currMonth)}
            span={currDayCumul}
            key={`month${i}`}
          />
        );
        monthAdded++;
        currIndexToAdd = parseInt(i) + monthAdded;
        currMonth = event.end;
        currDayCumul = 0;
      }

      currDayCumul += nbOfDaysBetween(event.start, event.end);
      eventsComp.push(
        <CalendarRow
          event={event}
          key={i}
          context={context}
          AdditionalInfo={AdditionalInfo}
        />
      );
    }

    let lastEvt = events[events.length - 1];
    if (isSameMonth(currMonth, lastEvt.end)) {
      // Le dernier mois n'est pas ajouté
      eventsComp.splice(
        currIndexToAdd,
        0,
        <Month
          name={formatMonthYear(currMonth)}
          span={currDayCumul}
          key="lastMonth"
        />
      );
    }

    return eventsComp;
  }, [events, AdditionalInfo, context]);
  return (
    <div className={style?.className} style={{ ...style?.props }}>
      <div
        className="grid px-5 py-2 rounded-lg border border-gray-600"
        style={{
          gridTemplateColumns: "7% 1fr 3fr 2fr",
          gridTemplateRows: `2em repeat(${dayNb},${cellHeight})`,
        }}
      >
        <div className="flex items-center justify-center bg-slate-400 font-bold col-start-3">
          Évenement
        </div>
        <div className="flex items-center justify-center bg-slate-400 font-bold">
          {additionalLabel}
        </div>
        {eventsUI}
      </div>
    </div>
  );
}

function Month({ name, span }: { name: string; span: number }) {
  return (
    <div
      className="pt-4 px-2 font-bold align-middle"
      style={{
        gridRow: "span " + span,
        writingMode: "vertical-rl",
        background:
          "linear-gradient(-120deg, hsl(47, 49%, 61%) 0%, hsl(47, 49%, 61%) 19%, rgba(0,0,0,0) 50%)",
      }}
    >
      <div className="text-right" style={{ transform: "rotate(-180deg)" }}>
        {name}
      </div>
    </div>
  );
}
