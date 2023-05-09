import { useLegendStore } from "@/components/legend/Legend";
import ZoomProvider from "@/components/zoom/ZoomProvider";
import { zoom_calendar_filiere } from "@/hooks/localStorageStore";
import { serializeDate } from "@/lib/date";
import { prisma } from "@/lib/db/prisma";
import { SerializedModule } from "@/lib/types";
import { notFound } from "next/navigation";
import CalendarFiliere from "./CalendarFiliere";

export type FiliereParamPage = {
  params: { filiereId: string };
};

export default async function FilierePage({
  params: { filiereId },
}: FiliereParamPage) {
  const filiereData = await prisma.filiere.findUnique({
    where: {
      nom: filiereId,
    },
    include: { modules: { include: { formateur: true } } },
  });
  if (!filiereData) {
    notFound();
  }
  const allThemes = filiereData.modules
    .filter(({ theme }) => theme !== null)
    .map(({ theme }) => theme as string);

  const showLegend = useLegendStore.getState().showLegend;
  showLegend([...new Set(allThemes)]);

  return (
    <ZoomProvider zoomKey={zoom_calendar_filiere}>
      <CalendarFiliere
        name={filiereId}
        modules={serializeDate<SerializedModule>(
          filiereData.modules.map((m) => ({
            ...m,
            label: m.nom,
          })),
          ["start", "end"]
        )}
      />
    </ZoomProvider>
  );
}
