import { useLegendStore } from "@/components/legend/Legend";
import MonthNavigationProvider from "@/components/monthNavigation/MonthNavigationProvider";
import ZoomProvider from "@/components/zoom/ZoomProvider";
import { zoom_calendar_formateur } from "@/hooks/localStorageStore";
import { parseMonthAndYear, serializeDate } from "@/lib/date";
import { getAllFormateursSimple } from "@/lib/db/formateurs";
import { getModulesOfFormateur } from "@/lib/db/ModuleRepository";
import { Formateur } from "@/lib/types";
import { SerializedInterval } from "@/packages/calendar/types";
import { addMonths, formatISO, startOfMonth, startOfToday } from "date-fns";
import { notFound } from "next/navigation";
import CalendarFormateur from "./CalendarFormateur";

export const dynamic = "force-dynamic"; // To get searchParams in prod

const monthStart = startOfMonth(startOfToday());
const monthLength = 3;

type FormateurPageProps = {
  params?: { formateurId: string };
  searchParams?: { date: string };
};

export default async function FormateurPage({
  params,
  searchParams,
}: FormateurPageProps) {
  const formateurs = new Map<string, Formateur>(
    (await getAllFormateursSimple()).map((f) => [f.mail, f as Formateur])
  );
  if (!params || !formateurs.has(decodeURIComponent(params.formateurId))) {
    notFound();
  }

  const formateur = formateurs.get(decodeURIComponent(params.formateurId))!;
  const month =
    searchParams && searchParams.date
      ? parseMonthAndYear(searchParams.date)
      : monthStart;
  const activInterval = {
    start: month,
    end: addMonths(month, monthLength),
  };
  const modules = await getModulesOfFormateur(formateur.mail, activInterval);
  const showLegend = useLegendStore.getState().showLegend;
  showLegend([...new Set(modules.map(({ theme }) => theme))]);

  return (
    <MonthNavigationProvider focus={formatISO(month || monthStart)}>
      <ZoomProvider zoomKey={zoom_calendar_formateur}>
        <CalendarFormateur
          data={serializeDate(modules, ["start", "end"])}
          formateur={formateur}
          timeSpan={
            serializeDate<SerializedInterval>(
              [activInterval],
              ["start", "end"]
            )[0]
          }
        />
      </ZoomProvider>
    </MonthNavigationProvider>
  );
}
