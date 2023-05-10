"use client";

import { formatFullDate, formatFullPrettyDate, formatTime } from "@/lib/date";
import { Formateur } from "@/lib/types";
import { Interval } from "@/packages/calendar/types";
import cn from "classnames";
import { Eye, EyeOff, RotateCcw } from "react-feather";
import { ModuleModification, useFiliereStore } from "./FiliereProvider";

export default function FiliereHistory() {
  const { historyData } = useFiliereStore();

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-bold ">Historique des modifications</h3>
      <ul
        className="steps steps-vertical w-11/12"
        style={{ gridAutoRows: "auto" }}
      >
        {historyData.map((history, i) => (
          <ModuleHistory key={i} {...history} />
        ))}
      </ul>
    </div>
  );
}

function ModuleHistory({
  date,
  modifications,
}: {
  date: number;
  modifications: ModuleModification[];
}) {
  return (
    <li className="step-neutral step" data-content="">
      <div className="mb-5 flex w-full items-center justify-between">
        <div className="text-left">
          <span className="italic">
            Depuis le {formatFullDate(new Date(date))} à{" "}
            {formatTime(new Date(date))} par Clément Birette
          </span>
          <div className="flex flex-col gap-2">
            {modifications.map((modification, i2) => (
              <Modification key={i2} modification={modification} />
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

function Modification({ modification }: { modification: ModuleModification }) {
  const { isVisible, toggleModificationVisibility } = useFiliereStore();

  const visible = isVisible(modification.id);
  return (
    <div className="group flex items-center gap-2">
      <div
        className={cn({
          "opacity-60": !visible,
        })}
      >
        <div className="font-bold">{modification.nom}</div>
        <div className="pl-3">
          <DiffDates {...modification} />
          <DiffFormateur {...modification} />
        </div>
      </div>
      <div className="invisible group-hover:visible">
        <button
          title={
            !visible
              ? "Afficher cette modification"
              : "Masquer cette modification"
          }
          className={`btn-ghost btn`}
          onClick={() => toggleModificationVisibility(modification.id)}
        >
          {!visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <button
          title="Revenir à cette version"
          className={`btn-ghost btn`}
          // onClick={deleteModification}
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
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
