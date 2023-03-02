import Legend from "@/components/legend/Legend";
import { getAllJoursFeries, getVacancesScolaire } from "@/lib/calendar";
import { serializeDate } from "@/lib/date";
import { startOfMonth, startOfToday } from "date-fns";
import { PropsWithChildren } from "react";
import CalendarInitializer from "./(components)/(calendar)/CalendarInitializer";
import { setSpecialDays } from "./(components)/(calendar)/CalendarProvider";
const monthStart = startOfMonth(startOfToday());

export default async function layout({ children }: PropsWithChildren) {
  const [joursFeries, vacances] = await Promise.all([
    getAllJoursFeries(monthStart),
    getVacancesScolaire(),
  ]);
  setSpecialDays({ joursFeries, vacances }); // For server side
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
