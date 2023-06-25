"use client";
import { JoursFeries } from "@/lib/calendar/joursFeries";
import { useRef } from "react";
import { setSpecialDays } from "../../(store)/specialDaysStore";

type SerializedSpecialDaysProps = {
  joursFeries: JoursFeries;
};
export default function CalendarInitializer({
  joursFeries,
}: SerializedSpecialDaysProps) {
  const initilized = useRef(false);
  if (!initilized.current) {
    setSpecialDays({
      joursFeries,
    });
    initilized.current = true;
  }

  return null;
}
