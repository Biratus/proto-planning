"use client";

import { useZoom } from "@/components/zoom/ZoomProvider";
import { moduleDayLabel, moduleOverlap } from "@/lib/calendar/calendar";
import { deserialize } from "@/lib/date";
import { Module, SerializedModule } from "@/lib/types";
import CalendarDetail from "@/packages/calendar/SingleData/CalendarDetail";
import { ComponentForEventProps } from "@/packages/calendar/types";
import { useMemo } from "react";
import { AlertTriangle, User } from "react-feather";
import EventComponent from "./EventComponent";

const viewWidth = 100;
const minCellHeight = 1.3;
const zoomCoef = 0.4;

export type ModuleForSingleCalendar = Module & { overlap: boolean };

export default function FilierePage({
  name,
  modules,
}: {
  name: string;
  modules: SerializedModule[];
}) {
  const filiereData: ModuleForSingleCalendar[] = useMemo(() => {
    let serMods = modules.map((m) => deserialize<Module>(m));

    return serMods.map((mod) => ({
      ...mod,
      overlap: serMods.some((m) => moduleOverlap(mod, m) && mod.id != m.id),
    }));
  }, [modules]);

  const { zoom } = useZoom();

  return (
    <div style={{ width: `${viewWidth + zoom * 10}%` }}>
      <CalendarDetail
        cellHeight={`${minCellHeight + zoom * zoomCoef}em`}
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
