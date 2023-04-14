import MonthNavigationProvider from "@/components/monthNavigation/MonthNavigationProvider";
import MonthNavigationUI from "@/components/monthNavigation/MonthNavigationUI";
import ZoomProvider from "@/components/zoom/ZoomProvider";
import ZoomUI from "@/components/zoom/ZoomUI";
import { zoom_calendar_full } from "@/hooks/localStorageStore";
import {
  getVacancesScolaire,
  makeVacancesData,
  SerializedVacanceData,
} from "@/lib/calendar/vacanceScolaire";
import { parseMonthAndYear, serializeDate } from "@/lib/date";
import { getModulesOfPeriod } from "@/lib/db/dataAccess";
import { SerializedModule } from "@/lib/types";
import {
  addMonths,
  endOfMonth,
  formatISO,
  startOfMonth,
  startOfToday,
} from "date-fns";
import CommonCalendar from "../(components)/(calendar)/Calendar";
import FiliereModal from "../(components)/(hover)/(modals)/FiliereModal";
import ModuleModal from "../(components)/(hover)/(modals)/ModuleModal";
import HoverElements from "../(components)/(hover)/HoverElements";
import SwitchView from "../(components)/SwitchView";

export const dynamic = "force-dynamic"; // To get searchParams in prod

const monthStart = startOfMonth(startOfToday());

type PlanningPageSearchParams = {
  date?: string;
};

type PlanningPageParams = {
  view: string;
};

export default async function PlanningPage({
  searchParams = {},
  params,
}: {
  searchParams?: PlanningPageSearchParams;
  params: PlanningPageParams;
}) {
  const dateQuery = searchParams.date;
  const view = params.view;
  let focusDate = dateQuery ? parseMonthAndYear(dateQuery) : monthStart;

  const data = await getVacancesScolaire(
    startOfMonth(addMonths(focusDate, -1)),
    endOfMonth(addMonths(focusDate, 4))
  );

  const activInterval = {
    start: startOfMonth(focusDate),
    end: endOfMonth(addMonths(focusDate, 4)),
  };
  const datas = serializeDate<SerializedModule>(
    await getModulesOfPeriod(activInterval),
    ["start", "end"]
  );

  console.log(`GOT ${datas.length} DATAS`);

  return (
    <>
      <MonthNavigationProvider focus={formatISO(focusDate)}>
        <ZoomProvider zoomKey={zoom_calendar_full}>
          <div className="mb-5 flex flex-row items-center justify-between gap-3">
            <SwitchView view={view} />
            <MonthNavigationUI />
            <ZoomUI range={5} />
          </div>
          <CommonCalendar
            data={datas}
            view={view}
            vacancesScolaire={serializeDate<SerializedVacanceData>(
              makeVacancesData(data),
              ["start", "end"]
            )}
          />
        </ZoomProvider>
      </MonthNavigationProvider>
      <FiliereModal />
      <ModuleModal />
      <HoverElements />
    </>
  );
}
