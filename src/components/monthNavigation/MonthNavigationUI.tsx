"use client";

import { ArrowLeftCircle, ArrowRightCircle } from "react-feather";
import FastSelectMonth from "./FastSelectMonth";
import { useMonthNavigation } from "./MonthNavigationProvider";

export default function MonthNavigationUI({
  disabled: { set, prev, next } = { set: false, prev: false, next: false },
}) {
  const [month, prevMonth, nextMonth, setMonth] = useMonthNavigation();
  return (
    <div className="flex flex-row gap-2 m-1 justify-center items-center">
      <FastSelectMonth
        focusedMonth={month}
        onChange={setMonth}
        // color="ajcBlue"
        disabled={set}
      />
      <button
        className="btn"
        onClick={prevMonth}
        // color="ajcBlue"
        disabled={prev}
      >
        <ArrowLeftCircle />
        <span className="mx-2">Mois précédent</span>
      </button>
      <button className="btn" onClick={nextMonth} disabled={next}>
        <span className="mx-2">Mois suivant</span>
        <ArrowRightCircle />
      </button>
    </div>
  );
}
