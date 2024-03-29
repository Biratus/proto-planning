import { getAllJoursFeries } from "@/lib/calendar/joursFeries";
import { startOfMonth, startOfToday } from "date-fns";
import { PropsWithChildren } from "react";
import CalendarInitializer from "./(components)/(calendar)/CalendarInitializer";
import { setSpecialDays } from "./(store)/specialDaysStore";
const monthStart = startOfMonth(startOfToday());

export default async function layout({ children }: PropsWithChildren) {
  const [joursFeries] = await Promise.all([getAllJoursFeries(monthStart)]);
  setSpecialDays({
    joursFeries,
  }); // For server side
  return (
    <>
      <CalendarInitializer joursFeries={joursFeries} />
      {children}
    </>
  );
}
