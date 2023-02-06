import Legend from "@/components/legend/Legend";
import { getAllJoursFeries } from "@/lib/calendar";
import { startOfMonth, startOfToday } from "date-fns";
import { PropsWithChildren } from "react";
import CalendarInitializer from "./(components)/(calendar)/CalendarInitializer";
import { setJoursFeries } from "./(components)/(calendar)/CalendarProvider";
import HoverElements from "./(components)/(hover)/HoverElements";
import SwitchPanelUI from "./(components)/SwitchPanelUI";
const monthStart = startOfMonth(startOfToday());

export default async function layout({ children }: PropsWithChildren) {
  const joursFeries = await getAllJoursFeries(monthStart);
  setJoursFeries(joursFeries);

  return (
    <div className="drawer drawer-end">
      <SwitchPanelUI />

      <div className="drawer-content">
        <CalendarInitializer joursFeries={joursFeries} />
        {children}
        <Legend />
      </div>
      <HoverElements />
    </div>
  );
}
