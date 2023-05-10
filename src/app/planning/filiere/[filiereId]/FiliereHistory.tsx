"use client";

import {
  deserialize,
  formatFullDate,
  formatFullPrettyDate,
  formatTime,
} from "@/lib/date";
import { Formateur, Module, ModuleHistory, Serialized } from "@/lib/types";
import { Interval } from "@/packages/calendar/types";
import { Eye, RotateCcw } from "react-feather";

type FiliereHistoryProps = {
  history: ModuleHistory[];
  currentData: Serialized<Module>[];
};

type ModuleModification = {
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

type HistoryModification = {
  date: number;
  modifications: ModuleModification[];
};

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
    let h: HistoryModification = { date: datetime, modifications: [] };

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

export default function FiliereHistory({
  history: originalHistory,
  currentData: serializedCurrentData,
}: FiliereHistoryProps) {
  const currentData = serializedCurrentData.map((m) => deserialize<Module>(m));
  const historyByDate = toMapDateHistory(originalHistory, currentData);

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-bold ">Historique des modifications</h3>
      <ul
        className="steps steps-vertical w-11/12"
        style={{ gridAutoRows: "auto" }}
      >
        {historyByDate.map((history, i) => (
          <ModuleHistory
            key={i}
            {...history}
            revert={() => console.log("TODO revert")}
            display={() => console.log("TODO display")}
          />
        ))}
      </ul>
    </div>
  );
}

function ModuleHistory({
  date,
  modifications,
  display,
  revert,
}: {
  date: number;
  modifications: ModuleModification[];
  display: () => void;
  revert: () => void;
}) {
  return (
    <li className="group step-neutral step" data-content="">
      <div className="mb-5 flex w-full items-center justify-between">
        <div className="text-left">
          <span className="italic">
            Depuis le {formatFullDate(new Date(date))} à{" "}
            {formatTime(new Date(date))} par Clément Birette
          </span>
          <div className="flex flex-col gap-2">
            {modifications.map((modification, i2) => (
              <div key={i2}>
                <div className="font-bold">{modification.nom}</div>
                <div className="pl-3">
                  <DiffDates {...modification} />
                  <DiffFormateur {...modification} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="invisible group-hover:visible">
          <button
            title="Afficher cette version"
            className={`btn-ghost btn`}
            onClick={display}
          >
            <Eye size={16} />
          </button>
          <button
            title="Revenir à cette version"
            className={`btn-ghost btn`}
            onClick={revert}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </li>
  );
}

function DiffFormateur({
  before,
  after,
}: {
  before: { formateur?: Formateur | null };
  after: { formateur?: Formateur | null };
}) {
  const beforeText = before.formateur
    ? `${before.formateur.nom} ${before.formateur.prenom}`
    : "N/A";
  const afterText = after.formateur
    ? `${after.formateur.nom} ${after.formateur.prenom}`
    : "N/A";
  return (
    <div>
      {beforeText} &rarr; {afterText}
    </div>
  );
}

function DiffDates({ before, after }: { before: Interval; after: Interval }) {
  return (
    <div className="flex items-center gap-4">
      <span>
        <div>Du {formatFullPrettyDate(before.start)}</div>
        <div>au {formatFullPrettyDate(before.end)}</div>
      </span>
      <span>&rarr;</span>
      <span className="font-bold">
        <div>Du {formatFullPrettyDate(after.start)}</div>
        <div>au {formatFullPrettyDate(after.end)}</div>
      </span>
    </div>
  );
}
