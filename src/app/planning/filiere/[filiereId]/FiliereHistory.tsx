"use client";

import { formatFullDate, formatFullPrettyDate, formatTime } from "@/lib/date";
import { Formateur } from "@/lib/types";
import { Interval } from "@/packages/calendar/types";
import cn from "classnames";
import { isSameDay } from "date-fns";
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

  const sameDate =
    isSameDay(modification.before.end, modification.after.end) &&
    isSameDay(modification.before.start, modification.after.start);
  const sameFormateur = compareFormateur(
    modification.before.formateur,
    modification.after.formateur
  );

  return (
    <div className="group flex items-center gap-2">
      <div
        className={cn({
          "opacity-60": !visible,
        })}
      >
        <div className="font-bold">{modification.nom}</div>
        <div className="pl-3">
          <DiffDates before={modification.before} after={modification.after} />
          <DiffFormateur
            before={modification.before}
            after={modification.after}
          />
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
  className,
}: {
  before: { formateur?: Formateur | null };
  after: { formateur?: Formateur | null };
} & React.HTMLAttributes<HTMLElement>) {
  const beforeText = before.formateur
    ? `${before.formateur.nom} ${before.formateur.prenom}`
    : "N/A";
  const afterText = after.formateur
    ? `${after.formateur.nom} ${after.formateur.prenom}`
    : "N/A";
  return (
    <div
      className={cn({
        "group-hover:visible": beforeText == afterText,
        invisible: beforeText == afterText,
      })}
    >
      {beforeText} &rarr;{" "}
      <span
        className={cn(className, {
          "font-bold": beforeText != afterText,
        })}
      >
        {afterText}
      </span>
    </div>
  );
}

function DiffDates({
  before,
  after,
  className,
}: { before: Interval; after: Interval } & React.HTMLAttributes<HTMLElement>) {
  const sameDate =
    isSameDay(after.start, before.start) && isSameDay(after.end, before.end);
  return (
    <div
      className={cn(`flex items-center gap-4 ${className}`, {
        "group-hover:visible": sameDate,
        invisible: sameDate,
      })}
    >
      <span>
        <div>Du {formatFullPrettyDate(before.start)}</div>
        <div>au {formatFullPrettyDate(before.end)}</div>
      </span>
      <span>&rarr;</span>
      <span
        className={cn({
          "font-bold": !sameDate,
        })}
      >
        <div>Du {formatFullPrettyDate(after.start)}</div>
        <div>au {formatFullPrettyDate(after.end)}</div>
      </span>
    </div>
  );
}

function compareFormateur(form1?: Formateur | null, form2?: Formateur | null) {
  return (!form1 && form2) || (form1 && !form2) || form1?.mail == form2?.mail;
}
