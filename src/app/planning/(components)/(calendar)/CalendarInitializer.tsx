"use client";
import { JoursFeries } from "@/lib/calendar/joursFeries";
import { VacanceScolaire } from "@/lib/calendar/vacanceScolaire";
import { mapISO } from "@/lib/date";
import { SerializedInterval } from "@/packages/calendar/types";
import { useRef } from "react";
import { setSpecialDays } from "./CalendarProvider";
type SerializedVacancesScolaire = Omit<VacanceScolaire, "start" | "end"> &
  SerializedInterval;

type SerializedSpecialDaysProps = {
  joursFeries: JoursFeries;
  vacances: SerializedVacancesScolaire[];
};
export default function CalendarInitializer({
  joursFeries,
  vacances,
}: SerializedSpecialDaysProps) {
  const initilized = useRef(false);
  if (!initilized.current) {
    setSpecialDays({
      joursFeries,
      vacances: mapISO<VacanceScolaire>(vacances, ["start", "end"]),
    });
    initilized.current = true;
  }

  return null;
}
