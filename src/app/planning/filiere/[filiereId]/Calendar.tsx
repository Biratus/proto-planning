"use client";

import { useLegendStore } from "@/components/legend/Legend";
import { useZoom } from "@/components/zoom/ZoomProvider";
import ZoomUI from "@/components/zoom/ZoomUI";
import { mapISO } from "@/lib/date";
import { isFormateurMissing } from "@/lib/realData";
import { Module, SerializedModule } from "@/lib/types";
import CalendarDetail from "@/packages/calendar/SingleData/CalendarDetail";
import Link from "next/link";
import { User } from "react-feather";
import { missingFormateurStyle } from "../../(components)/(calendar)/CalendarStyle";
import { FiliereView } from "../../(components)/(calendar)/CalendarView";
import GlobalViewLink from "../../(components)/GlobalViewLink";

const viewWidth = 50;
const minCellHeight = 1.3;
const zoomCoef = 0.4;

export default function CalendarFiliere({
  name,
  modules,
}: {
  name: string;
  modules: SerializedModule[];
}) {
  const filiereData = mapISO<Module>(modules, ["start", "end"]);
  const colorOf = useLegendStore((state) => state.colorOf);

  const { zoom } = useZoom();
  //   const { openMenu } = useCalendar();

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
          eventProps={{
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
            label: (mod: Module) => mod.nom,
          }}
          additionalLabel="Formateur"
          AdditionalInfo={FormateurSimple}
        />
      </div>
    </div>
  );
}

function FormateurSimple({
  event: {
    formateur = { nom: "NA", prenom: "NA", mail: "NA.NA@ajc-formation.fr" },
  },
}: {
  event: Module;
}) {
  return (
    <div className="flex h-full flex-row items-center gap-3">
      <User /> <span>{formateur.nom + " " + formateur.prenom}</span>
    </div>
  );
}
