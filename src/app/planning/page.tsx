import MonthNavigationProvider from "@/components/monthNavigation/MonthNavigationProvider";
import MonthNavigationUI from "@/components/monthNavigation/MonthNavigationUI";
import ZoomProvider from "@/components/zoom/ZoomProvider";
import ZoomUI from "@/components/zoom/ZoomUI";
import { zoom_calendar_full } from "@/hooks/localStorageStore";
import { parseMonthAndYear } from "@/lib/date";
import { modules } from "@/lib/realData";
import { formatISO, startOfMonth, startOfToday } from "date-fns";
import CommonCalendar from "./(components)/(calendar)/Calendar";
import FiliereModal from "./(components)/(hover)/(modals)/FiliereModal";
import ModuleModal from "./(components)/(hover)/(modals)/ModuleModal";
import HoverElements from "./(components)/(hover)/HoverElements";
import SwitchView from "./(components)/SwitchView";

export const dynamic = "force-dynamic"; // To get searchParams in prod

const monthStart = startOfMonth(startOfToday());

export default function PlanningPage({ searchParams }: { searchParams?: any }) {
  const { date, view } = searchParams;
  let focusDate = date ? parseMonthAndYear(date) : monthStart;

  return (
    <>
      <MonthNavigationProvider focus={formatISO(focusDate)}>
        <ZoomProvider zoomKey={zoom_calendar_full}>
          <div className="mb-5 flex flex-row items-center justify-between gap-3">
            <SwitchView view={view} />
            <MonthNavigationUI />
            <ZoomUI range={5} />
          </div>
          <CommonCalendar modules={modules} view={view} />
        </ZoomProvider>
      </MonthNavigationProvider>
      <FiliereModal />
      <ModuleModal />
      <HoverElements />
    </>
  );
}
