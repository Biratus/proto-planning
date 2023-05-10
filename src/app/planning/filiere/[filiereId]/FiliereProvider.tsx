"use client";

import { deserialize } from "@/lib/date";
import { Formateur, Module, ModuleHistory, Serialized } from "@/lib/types";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
type FiliereStore = {
  filiereData: Module[];
  displayedFiliereData: Module[];
  historyData: HistoryModification[];
  isVisible: (historyId: number) => boolean | undefined;
  toggleModificationVisibility: (modificationId: number) => void;
};

export type ModuleModification = {
  id: number;
  module_id: number;
  nom: string;
  after: {
    start: Date;
    end: Date;
    formateur?: Formateur | null;
  };
  before: {
    start: Date;
    end: Date;
    formateur?: Formateur | null;
  };
};

export type HistoryModification = {
  date: number;
  modifications: ModuleModification[];
};
export const FiliereContext = createContext<FiliereStore | null>(null);

export default function FiliereProvider({
  filiereData,
  filiereHistory,
  children,
}: {
  filiereData: Serialized<Module>[];
  filiereHistory: Serialized<ModuleHistory>[];
} & PropsWithChildren) {
  const [historyVisiblity, setHistoryVisibility] = useState(
    new Map<number, boolean>()
  );

  const isVisible = useCallback(
    (historyId: number) =>
      historyVisiblity.has(historyId) ? historyVisiblity.get(historyId) : true,
    [historyVisiblity]
  );

  const deserializedFiliereData = useMemo(
    () => filiereData.map((m) => deserialize<Module>(m)),
    [filiereData]
  );

  const history = useMemo(
    () =>
      toMapDateHistory(
        filiereHistory.map((h) => deserialize<ModuleHistory>(h)),
        deserializedFiliereData
      ),
    [deserializedFiliereData, filiereHistory]
  );

  const displayedFiliereData = useMemo(() => {
    const filiereData: Module[] = [];
    for (let mod of deserializedFiliereData) {
      const histories = filiereHistory.filter((h) => h.module_id == mod.id);

      // No modification or all modifications visible
      if (histories.length == 0 || histories.every((h) => isVisible(h.id))) {
        filiereData.push(mod);
        continue;
      }

      // There has been a modification on this module and the visibility has been toggled

      // histories sorted by modification date desc
      const sortedHistories = histories
        .map((h) => deserialize<ModuleHistory>(h))
        .sort(
          (h1, h2) =>
            h2.modified_datetime.getTime() - h1.modified_datetime.getTime()
        );

      // get most recent visible history
      let displayedData = sortedHistories[0];

      for (let history of sortedHistories) {
        if (isVisible(history.id)) break;
        displayedData = history;
      }
      filiereData.push({
        ...displayedData,
        id: displayedData.module_id,
      });
    }

    return filiereData;
  }, [deserializedFiliereData, filiereHistory, history, isVisible]);

  const toggleModificationVisibility = useCallback(
    (modificationId: number) => {
      historyVisiblity.set(
        modificationId,
        historyVisiblity.has(modificationId)
          ? !historyVisiblity.get(modificationId)
          : false
      );
      setHistoryVisibility(new Map(historyVisiblity));
    },
    [historyVisiblity]
  );

  return (
    <FiliereContext.Provider
      value={{
        historyData: history,
        filiereData: deserializedFiliereData,
        displayedFiliereData,
        isVisible,
        toggleModificationVisibility,
      }}
    >
      {children}
    </FiliereContext.Provider>
  );
}

export function useFiliereStore() {
  const ctx = useContext(FiliereContext);
  if (!ctx) {
    throw new Error("useFiliereStore must be used within a FiliereProvider");
  }
  return ctx;
}

function toMapDateHistory(history: ModuleHistory[], currentData: Module[]) {
  let map = new Map<number, ModuleHistory[]>();
  let historyMap = new Map<number, ModuleHistory[]>();
  let moduleMap = new Map(currentData.map((m) => [m.id, m]));

  for (let h of history) {
    // group by modified date
    if (!map.has(h.modified_datetime.getTime()))
      map.set(h.modified_datetime.getTime(), []);
    map.get(h.modified_datetime.getTime())!.push(h);

    // group by module_id
    if (!historyMap.has(h.module_id)) historyMap.set(h.module_id, []);
    historyMap.get(h.module_id)!.push(h);
  }

  let historyArr: HistoryModification[] = [];

  // Add previous value
  for (let [datetime, modifications] of map) {
    let h: HistoryModification = {
      date: datetime,
      modifications: [],
    };

    for (let before of modifications) {
      let after = historyMap
        .get(before.module_id)!
        .sort(
          (h1, h2) =>
            h1.modified_datetime.getTime() - h2.modified_datetime.getTime()
        )
        .find(
          (m) =>
            m.modified_datetime.getTime() > before.modified_datetime.getTime()
        );
      h.modifications.push({
        before,
        after: after || moduleMap.get(before.module_id)!,
        ...before,
      });
    }
    historyArr.push(h);
  }
  return historyArr;
}
