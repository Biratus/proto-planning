import Legend from "@/components/legend/Legend";
import { getAllJoursFeries } from "@/lib/calendar/joursFeries";
import { getVacancesScolaire } from "@/lib/calendar/vacanceScolaire";
import { serializeDate } from "@/lib/date";
import { addMonths, endOfMonth, startOfMonth, startOfToday } from "date-fns";
import { PropsWithChildren } from "react";
import CalendarInitializer from "./(components)/(calendar)/CalendarInitializer";
import { setSpecialDays } from "./(components)/(calendar)/CalendarProvider";
const monthStart = startOfMonth(startOfToday());

export default async function layout({ children }: PropsWithChildren) {
  const [joursFeries, vacances] = await Promise.all([
    getAllJoursFeries(monthStart),
    getVacancesScolaire(
      startOfMonth(addMonths(monthStart, -1)),
      endOfMonth(addMonths(monthStart, 4))
    ),
  ]);
  setSpecialDays({
    joursFeries,
    vacances,
  }); // For server side
  return (
    <>
      <CalendarInitializer
        joursFeries={joursFeries}
        vacances={serializeDate(vacances, ["start", "end"])}
      />
      {children}
      <Legend />
    </>
  );
}
