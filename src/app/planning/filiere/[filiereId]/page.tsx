import { useLegendStore } from "@/components/legend/Legend";
import { serialize } from "@/lib/date";
import { getModuleHistoryOfFiliere } from "@/lib/db/ModuleAuditRepository";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "react-feather";
import { FiliereView } from "../../(components)/(calendar)/CalendarView";
import GlobalViewLink from "../../(components)/GlobalViewLink";
import FiliereHistory from "./FiliereHistory";
import FilierePage from "./FilierePage";
import FiliereProvider from "./FiliereProvider";

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

  // initializeStore(
  //   filiereData!.modules.map((m) => ({ ...m, filiere: { nom: filiereId } })),
  //   filiereHistory
  // );

  return (
    <div>
      <h2 className="text-center">{filiereId}</h2>

      <div className="flex justify-center gap-3">
        <GlobalViewLink view={FiliereView.key} />
        <button className="btn-link btn">
          <Link href={`/api/filiere/${filiereId}/pdf`} prefetch={false}>
            <Download />
            PDF Planning
          </Link>
        </button>
      </div>
      <div className="flex justify-between">
        <FiliereProvider
          filiereData={filiereData!.modules
            .map((m) => ({
              ...m,
              filiere: { nom: filiereId },
            }))
            .map((m) => serialize(m))}
          filiereHistory={filiereHistory.map((h) => serialize(h))}
        >
          <div className="w-2/3">
            <FilierePage />
          </div>
          <div className="w-1/2">
            <FiliereHistory />
          </div>
        </FiliereProvider>
      </div>
    </div>
  );
}
