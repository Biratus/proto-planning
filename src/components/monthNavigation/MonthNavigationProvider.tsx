"use client";

import { formatMonthYear } from "@/lib/date";
import { searchParamsClone } from "@/lib/navigation";
import { addMonths, parseISO, startOfMonth, subMonths } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, PropsWithChildren, useContext } from "react";

type NavigationContext = [Date, () => void, () => void, (value: Date) => void];

const MonthNavigationContext = createContext<NavigationContext>([
  new Date(),
  () => {},
  () => {},
  () => {},
]);

export default function MonthNavigationProvider({
  focus,
  children,
}: { focus: string } & PropsWithChildren) {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();

  const month = parseISO(focus);

  const nextMonth = () => {
    replaceRoute({ date: formatMonthYear(addMonths(month, 1)) });
  };
  const prevMonth = () => {
    replaceRoute({ date: formatMonthYear(subMonths(month, 1)) });
  };

  const setMonth = (value: Date) => {
    replaceRoute({ date: formatMonthYear(startOfMonth(value)) });
  };

  const replaceRoute = (additionalParams: any) => {
    let newParams = searchParamsClone(params);

    for (let k in additionalParams) {
      newParams.set(k, additionalParams[k]);
    }
    router.replace(path + "?" + newParams.toString());
  };

  return (
    <MonthNavigationContext.Provider
      value={[month, prevMonth, nextMonth, setMonth]}
    >
      {children}
    </MonthNavigationContext.Provider>
  );
}

export function useMonthNavigation() {
  const ctx = useContext(MonthNavigationContext);
  if (ctx === undefined) {
    throw new Error(
      "useMonthNavigation must be used within a MonthNavigationContext"
    );
  }
  return ctx;
}
