import { useLegendStore } from "@/components/legend/Legend";
import ZoomProvider from "@/components/zoom/ZoomProvider";
import ZoomUI from "@/components/zoom/ZoomUI";
import { zoom_calendar_filiere } from "@/hooks/localStorageStore";
import { serialize } from "@/lib/date";
import { getModuleHistoryOfFiliere } from "@/lib/db/ModuleAuditRepository";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiliereView } from "../../(components)/(calendar)/CalendarView";
import GlobalViewLink from "../../(components)/GlobalViewLink";
import FiliereHistory from "./FiliereHistory";
import FilierePage from "./FilierePage";

export type FiliereParamPage = {
  params: { filiereId: string };
};

export default async function Page({
  params: { filiereId },
}: FiliereParamPage) {
  const filiereData = await prisma.filiere.findUnique({
    where: {
      nom: filiereId,
    },
    include: {
      modules: { include: { formateur: true }, orderBy: { start: "asc" } },
    },
  });
  if (!filiereData) {
    notFound();
  }
  const allThemes = filiereData.modules
    .filter(({ theme }) => theme !== null)
    .map(({ theme }) => theme as string);

  const filiereHistory = await getModuleHistoryOfFiliere(filiereId);

  useLegendStore.getState().showLegend([...new Set(allThemes)]);

  return (
    <div>
      <h2 className="text-center">{filiereId}</h2>

      <div className="flex justify-center gap-3">
        <GlobalViewLink view={FiliereView.key} />
        <button className="btn-link btn">
          <Link href={`/api/filiere/${filiereId}/pdf`}>Export to PDF</Link>
        </button>
      </div>
      <div className="flex justify-between">
        <div className="w-1/2">
          <ZoomProvider zoomKey={zoom_calendar_filiere}>
            <ZoomUI range={5} />

            <FilierePage
              name={filiereId}
              modules={filiereData.modules
                .map(serialize)
                .map((m) => ({ ...m, filiere: { nom: filiereId } }))}
            />
          </ZoomProvider>
        </div>
        <div className="w-1/2">
          <FiliereHistory
            history={filiereHistory}
            currentData={filiereData.modules
              .map(serialize)
              .map((m) => ({ ...m, filiere: { nom: filiereId } }))}
          />
        </div>
      </div>
    </div>
  );
}
