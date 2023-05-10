"use client";

import { moduleDayLabel, moduleOverlap } from "@/lib/calendar/calendar";
import { Module } from "@/lib/types";
import CalendarDetail from "@/packages/calendar/SingleData/CalendarDetail";
import { ComponentForEventProps } from "@/packages/calendar/types";
import { useMemo } from "react";
import { AlertTriangle, User } from "react-feather";
import EventComponent from "./EventComponent";
import { useFiliereStore } from "./FiliereProvider";

export type ModuleForSingleCalendar = Module & { overlap: boolean };

export default function FilierePage() {
  const { displayedFiliereData } = useFiliereStore();
  console.log("FilierePage");
  const filiereData: ModuleForSingleCalendar[] = useMemo(() => {
    return displayedFiliereData
      .sort((mod1, mod2) => mod1.start.getTime() - mod2.start.getTime())
      .map((mod) => ({
        ...mod,
        overlap: displayedFiliereData.some(
          (m) => moduleOverlap(mod, m) && mod.id != m.id
        ),
      }));
  }, [displayedFiliereData]);

  return (
    <div>
      <CalendarDetail
        cellHeight={`1fr`}
        events={filiereData}
        dayComponent={DayComponent}
        eventComponent={EventComponent}
        additionalLabel="Formateur"
        AdditionalInfo={FormateurSimple}
      />
    </div>
  );
}

function DayComponent({
  event: module,
  ...props
}: ComponentForEventProps<ModuleForSingleCalendar>) {
  return (
    <div
      className={`flex items-center gap-2 ${props.className}`}
      style={{ ...props.style }}
    >
      {module.overlap && <AlertTriangle color="red" />} {moduleDayLabel(module)}
    </div>
  );
}

function FormateurSimple({ event: { formateur } }: { event: Module }) {
  return (
    <div className="flex h-full flex-row items-center gap-3">
      <User />{" "}
      <span>{formateur ? formateur.nom + " " + formateur.prenom : "N/A"}</span>
    </div>
  );
}
