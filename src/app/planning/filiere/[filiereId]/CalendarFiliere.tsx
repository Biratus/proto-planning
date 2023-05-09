"use client";

import { useZoom } from "@/components/zoom/ZoomProvider";
import ZoomUI from "@/components/zoom/ZoomUI";
import { moduleDayLabel, moduleOverlap } from "@/lib/calendar/calendar";
import { deserialize } from "@/lib/date";
import { Module, SerializedModule } from "@/lib/types";
import CalendarDetail from "@/packages/calendar/SingleData/CalendarDetail";
import { ComponentForEventProps } from "@/packages/calendar/types";
import Link from "next/link";
import { useMemo } from "react";
import { AlertTriangle, User } from "react-feather";
import { FiliereView } from "../../(components)/(calendar)/CalendarView";
import GlobalViewLink from "../../(components)/GlobalViewLink";
import EventComponent from "./EventComponent";

const viewWidth = 50;
const minCellHeight = 1.3;
const zoomCoef = 0.4;

export type ModuleForSingleCalendar = Module & { overlap: boolean };

export default function CalendarFiliere({
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
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-center">{name}</h2>
      <div className="flex w-2/4 flex-row justify-between">
        <GlobalViewLink view={FiliereView.key} />
        <ZoomUI range={5} />
        <button className="btn-link btn">
          <Link href={`/api/filiere/${name}/pdf`}>Export to PDF</Link>
        </button>
      </div>
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
