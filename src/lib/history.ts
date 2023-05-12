import { Formateur, Module, ModuleHistory } from "./types";

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

export function toMapDateHistory(
  history: ModuleHistory[],
  currentData: Module[]
) {
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

export function getDisplayedFiliereData(
  originalData: Module[],
  filiereHistory: ModuleHistory[],
  isVisible: (historyId: number) => boolean | undefined
) {
  const filiereData: Module[] = [];
  for (let mod of originalData) {
    const histories = filiereHistory.filter((h) => h.module_id == mod.id);

    // No modification or all modifications visible
    if (histories.length == 0 || histories.every((h) => isVisible(h.id))) {
      filiereData.push(mod);
      continue;
    }

    // There has been a modification on this module and the visibility has been toggled

    // histories sorted by modification date desc
    const sortedHistories = histories.sort(
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
}

export function getModificationConflicts(
  targetHistory: ModuleHistory,
  filiereHistory: ModuleHistory[]
) {
  return filiereHistory.filter(
    (h) =>
      h.module_id == targetHistory.module_id &&
      h.id != targetHistory.id &&
      h.modified_datetime.getTime() > targetHistory.modified_datetime.getTime()
  );
}

export function makeRevertConflictModification(
  targetHistory: ModuleHistory,
  revertConflicts: ModuleHistory[],
  currentData: Module
) {
  const sortedConflicts = revertConflicts.sort(
    (h1, h2) => h1.modified_datetime.getTime() - h2.modified_datetime.getTime()
  );

  const modifications: (ModuleModification & {
    modified_datetime: Date;
  })[] = [];
  let after = currentData;

  for (let c of sortedConflicts) {
    modifications.push({
      id: c.id,
      nom: c.nom,
      module_id: c.module_id,
      after,
      before: { ...c },
      modified_datetime: c.modified_datetime,
    });
    after = c;
  }
  modifications.push({
    id: targetHistory.id,
    nom: targetHistory.nom,
    module_id: targetHistory.module_id,
    after,
    before: { ...targetHistory },
    modified_datetime: targetHistory.modified_datetime,
  });
  return modifications;
}
