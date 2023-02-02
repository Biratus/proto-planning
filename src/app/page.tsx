import Legend from "@/components/legend/Legend";
import { parseMonthAndYear } from "@/lib/date";
import { startOfMonth, startOfToday } from "date-fns";

const monthStart = startOfMonth(startOfToday());

export default function Home({ searchParams: { date } }: any) {
  console.log({ date });
  if (date) date = parseMonthAndYear(date);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Legend />
    </>
  );
}
