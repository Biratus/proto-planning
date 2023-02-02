"use client";
import { JoursFeries } from "@/lib/calendar";
import { useRef } from "react";
import { setJoursFeries } from "./CalendarProvider";

export default function CalendarInitializer({
  joursFeries,
}: {
  joursFeries: JoursFeries;
}) {
  const initilized = useRef(false);
  if (!initilized.current) {
    setJoursFeries(joursFeries);
    initilized.current = true;
  }

  return null;
}
