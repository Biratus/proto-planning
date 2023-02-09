"use client";
import { useLegendStore } from "@/components/legend/Legend";
import MonthNavigationProvider from "@/components/monthNavigation/MonthNavigationProvider";
import ZoomProvider from "@/components/zoom/ZoomProvider";
import { zoom_calendar_formateur } from "@/hooks/localStorageStore";
import { parseMonthAndYear } from "@/lib/date";
import { formateurs, getModulesOfFormateur } from "@/lib/realData";
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

export default function FormateurPage({
  params,
  searchParams,
}: FormateurPageProps) {
  if (!params || !formateurs.has(decodeURIComponent(params.formateurId))) {
    notFound();
  }

  const formateur = formateurs.get(decodeURIComponent(params.formateurId))!;
  const month =
    searchParams && searchParams.date
      ? parseMonthAndYear(searchParams.date)
      : monthStart;

  const modules = getModulesOfFormateur(formateur.mail, {
    start: month,
    end: addMonths(month, monthLength),
  });
  const showLegend = useLegendStore((s) => s.showLegend);
  showLegend([...new Set(modules.map(({ theme }) => theme))]);

  return (
    <MonthNavigationProvider focus={formatISO(month || monthStart)}>
      <ZoomProvider zoomKey={zoom_calendar_formateur}>
        <CalendarFormateur data={modules} formateur={formateur} />
      </ZoomProvider>
    </MonthNavigationProvider>
  );
}
