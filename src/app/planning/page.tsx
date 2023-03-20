"use client";
import LoadingBar from "@/components/LoadingBar";
import MonthNavigationProvider from "@/components/monthNavigation/MonthNavigationProvider";
import MonthNavigationUI from "@/components/monthNavigation/MonthNavigationUI";
import ZoomProvider from "@/components/zoom/ZoomProvider";
import ZoomUI from "@/components/zoom/ZoomUI";
import { zoom_calendar_full } from "@/hooks/localStorageStore";
import {
  getSWRVacancesScolaire,
  makeVacancesData,
  VacanceScolaire,
} from "@/lib/calendar/vacanceScolaire";
import { parseMonthAndYear } from "@/lib/date";
import { modules } from "@/lib/realData";
import {
  addMonths,
  endOfMonth,
  formatISO,
  startOfMonth,
  startOfToday,
} from "date-fns";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import CommonCalendar from "./(components)/(calendar)/Calendar";
import FiliereModal from "./(components)/(hover)/(modals)/FiliereModal";
import ModuleModal from "./(components)/(hover)/(modals)/ModuleModal";
import HoverElements from "./(components)/(hover)/HoverElements";
import SwitchView from "./(components)/SwitchView";

export const dynamic = "force-dynamic"; // To get searchParams in prod

const monthStart = startOfMonth(startOfToday());

export default function PlanningPage({ searchParams }: { searchParams?: any }) {
  const params = useSearchParams();
  const dateQuery = params ? params.get("date") : null;
  const view = params ? params.get("view") : null;
  let focusDate = dateQuery ? parseMonthAndYear(dateQuery) : monthStart;

  const [url, fetchData] = getSWRVacancesScolaire(
    startOfMonth(addMonths(focusDate, -1)),
    endOfMonth(addMonths(focusDate, 4))
  );

  const { data, isLoading } = useSWR(
    url,
    fetchData as (url: string) => Promise<VacanceScolaire[]>,
    { revalidateOnFocus: false }
  );
  return (
    <>
      <MonthNavigationProvider focus={formatISO(focusDate)}>
        <ZoomProvider zoomKey={zoom_calendar_full}>
          <div className="mb-5 flex flex-row items-center justify-between gap-3">
            <SwitchView view={view || undefined} />
            <MonthNavigationUI />
            <ZoomUI range={5} />
          </div>
          {!isLoading && data && (
            <CommonCalendar
              modules={modules}
              view={view || undefined}
              vacancesScolaire={makeVacancesData(data)}
            />
          )}
          {(isLoading || !data) && <LoadingBar />}
        </ZoomProvider>
      </MonthNavigationProvider>
      <FiliereModal />
      <ModuleModal />
      <HoverElements />
    </>
  );
}
