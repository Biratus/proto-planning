"use client";

import { ModuleHistoryUI } from "@/components/history/ModuleHistory";
import { useFiliereStore } from "./FiliereProvider";

export default function FiliereHistory() {
  const { historyData } = useFiliereStore();

  return (
    <div className="sticky top-0 flex flex-col items-center gap-4 overflow-auto">
      <h3 className="text-lg font-bold ">Historique des modifications</h3>
      <ul
        className="steps steps-vertical w-11/12"
        style={{ gridAutoRows: "auto" }}
      >
        {historyData.map((history, i) => (
          <ModuleHistoryUI key={i} {...history} />
        ))}
      </ul>
    </div>
  );
}
