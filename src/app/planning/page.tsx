import AfterHydration from "@/components/AfterHydration";
import MonthNavigationProvider from "@/components/monthNavigation/MonthNavigationProvider";
import MonthNavigationUI from "@/components/monthNavigation/MonthNavigationUI";
import ZoomProvider from "@/components/zoom/ZoomProvider";
import { zoom_calendar_full } from "@/hooks/localStorageStore";
import { parseMonthAndYear } from "@/lib/date";
import { modules } from "@/lib/realData";
import { formatISO, startOfMonth, startOfToday } from "date-fns";
import CommonCalendar from "./(components)/(calendar)/Calendar";

const monthStart = startOfMonth(startOfToday());

export default function page({ searchParams: { date } }: any) {
  if (date) date = parseMonthAndYear(date);

  return (
    <MonthNavigationProvider focus={formatISO(date || monthStart)}>
      <MonthNavigationUI />
      <ZoomProvider zoomKey={zoom_calendar_full}>
        <AfterHydration>
          <CommonCalendar modules={modules} />
        </AfterHydration>
      </ZoomProvider>
    </MonthNavigationProvider>
  );
}
