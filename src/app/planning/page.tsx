import MonthNavigationProvider from "@/components/monthNavigation/MonthNavigationProvider";
import MonthNavigationUI from "@/components/monthNavigation/MonthNavigationUI";
import ZoomProvider from "@/components/zoom/ZoomProvider";
import { zoom_calendar_full } from "@/hooks/localStorageStore";
import { parseMonthAndYear } from "@/lib/date";
import { modules } from "@/lib/realData";
import { formatISO, startOfMonth, startOfToday } from "date-fns";
import CommonCalendar from "./(components)/(calendar)/Calendar";
import FiliereModal from "./(components)/(modals)/filiere";
import ViewDropdown from "./(components)/ViewDropdown";

export const dynamic = "force-dynamic"; // To get searchParams in prod

const monthStart = startOfMonth(startOfToday());

export default function PlanningPage({ searchParams }: { searchParams?: any }) {
  const { date, view } = searchParams;
  let focusDate = date ? parseMonthAndYear(date) : monthStart;

  return (
    <>
      <MonthNavigationProvider focus={formatISO(focusDate)}>
        <ViewDropdown view={view} />
        <MonthNavigationUI />
        <ZoomProvider zoomKey={zoom_calendar_full}>
          <CommonCalendar modules={modules} view={view} />
        </ZoomProvider>
      </MonthNavigationProvider>
      <FiliereModal />
    </>
  );
}
