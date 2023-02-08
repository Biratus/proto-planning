"use client";

import CalendarDetail from "@/components/calendar/SingleData/CalendarDetail";
import { missingFormateurStyle } from "@/components/calendar/styles";
import { CalendarDetailContext } from "@/components/calendar/types";
import { useLegendStore } from "@/components/legend/Legend";
import { useZoom } from "@/components/zoom/ZoomProvider";
import ZoomUI from "@/components/zoom/ZoomUI";
import { mapISO } from "@/lib/date";
import { isFormateurMissing } from "@/lib/realData";
import { Module, RawModule } from "@/lib/types";
import Link from "next/link";
import { createContext, useRef } from "react";
import { User } from "react-feather";
import GlobalViewLink from "../../(components)/GlobalViewLink";

const viewWidth = 50;
const minCellHeight = 1.3;
const zoomCoef = 0.4;

export default function CalendarFiliere({
  name,
  modules,
}: {
  name: string;
  modules: RawModule[];
}) {
  const filiereData = mapISO<Module>(modules, ["start", "end"]);
  const colorOf = useLegendStore((state) => state.colorOf);

  const zoom = useZoom((s) => s.value);
  //   const { openMenu } = useCalendar();
  const FiliereContext = useRef(
    createContext<CalendarDetailContext<Module>>({
      style: (mod: Module) => {
        if (mod.name == "INIT BDD ET SQL") debugger;
        return isFormateurMissing(mod)
          ? missingFormateurStyle(colorOf(mod.theme))
          : {
              className: "",
              props: { backgroundColor: colorOf(mod.theme) },
            };
      },
      onClick: (mod: Module) => {
        console.log("TODO onClick", mod);
        //openMenu()
      },
      label: (mod: Module) => mod.name,
    })
  ).current;
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h2 className="text-center">{name}</h2>
      <div className="flex flex-row justify-between w-2/4">
        <GlobalViewLink />
        <ZoomUI range={5} />
        <button className="btn btn-link">
          <Link href={`/api/filiere/${name}/pdf`}>Export to PDF</Link>
        </button>
      </div>
      <div style={{ width: `${viewWidth + zoom * 10}%` }}>
        <FiliereContext.Provider
          value={{
            style: (mod: Module) => {
              return isFormateurMissing(mod)
                ? missingFormateurStyle(colorOf(mod.theme))
                : {
                    className: "",
                    props: { backgroundColor: colorOf(mod.theme) },
                  };
            },
            onClick: (mod: Module) => {
              console.log("TODO onClick", mod);
              //openMenu()
            },
            label: (mod: Module) => mod.name,
          }}
        >
          <CalendarDetail
            context={FiliereContext}
            cellHeight={`${minCellHeight + zoom * zoomCoef}em`}
            events={filiereData}
            additionalLabel="Formateur"
            AdditionalInfo={FormateurSimple}
          />
        </FiliereContext.Provider>
      </div>
    </div>
  );
}

function FormateurSimple({ event: { formateur } }: { event: Module }) {
  return (
    <div className="flex flex-row items-center gap-3 h-full">
      <User /> <span>{formateur.nom + " " + formateur.prenom}</span>
    </div>
  );
}
