import { useLegendStore } from "@/components/legend/Legend";
import ZoomProvider from "@/components/zoom/ZoomProvider";
import { zoom_calendar_filiere } from "@/hooks/localStorageStore";
import { fetchFiliere } from "@/lib/realData";
import { notFound } from "next/navigation";
import CalendarFiliere from "./Calendar";

export type FiliereParamPage = {
  params: { filiereId: string };
};

export default function FilierePage({
  params: { filiereId },
}: FiliereParamPage) {
  const filiereData = fetchFiliere(filiereId).map((m) => ({
    ...m,
    label: m.name,
  }));

  if (filiereData.length == 0) {
    notFound();
  }
  const showLegend = useLegendStore.getState().showLegend;
  showLegend([...new Set(filiereData.map(({ theme }) => theme))]);

  return (
    <ZoomProvider zoomKey={zoom_calendar_filiere}>
      <CalendarFiliere name={filiereId} modules={filiereData} />
    </ZoomProvider>
  );
}
