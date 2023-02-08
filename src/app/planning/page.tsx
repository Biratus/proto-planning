import MonthNavigationProvider from "@/components/monthNavigation/MonthNavigationProvider";
import MonthNavigationUI from "@/components/monthNavigation/MonthNavigationUI";
import ZoomProvider from "@/components/zoom/ZoomProvider";
import { zoom_calendar_full } from "@/hooks/localStorageStore";
import { parseMonthAndYear } from "@/lib/date";
import { modules } from "@/lib/realData";
import { formatISO, startOfMonth, startOfToday } from "date-fns";
import CommonCalendar from "./(components)/(calendar)/Calendar";
import ViewDropdown from "./(components)/ViewDropdown";

const monthStart = startOfMonth(startOfToday());

export default function page({ searchParams: { date, view } }: any) {
  if (date) date = parseMonthAndYear(date);

  return (
    <MonthNavigationProvider focus={formatISO(date || monthStart)}>
      <ViewDropdown view={view} />
      <MonthNavigationUI />
      <ZoomProvider zoomKey={zoom_calendar_full}>
        <CommonCalendar modules={modules} view={view} />
      </ZoomProvider>
    </MonthNavigationProvider>
  );
}
