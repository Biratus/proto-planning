import MonthNavigationProvider from "@/components/monthNavigation/MonthNavigationProvider";
import MonthNavigationUI from "@/components/monthNavigation/MonthNavigationUI";
import { parseMonthAndYear } from "@/lib/date";
import { formatISO, startOfMonth, startOfToday } from "date-fns";

const monthStart = startOfMonth(startOfToday());

export default function Home({ searchParams: { date } }: any) {
  console.log({ date });
  if (date) date = parseMonthAndYear(date);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <MonthNavigationProvider focus={formatISO(date || monthStart)}>
        <MonthNavigationUI />
      </MonthNavigationProvider>
    </>
  );
}
