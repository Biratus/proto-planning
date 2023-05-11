import {
  ModuleModification,
  useFiliereStore,
} from "@/app/planning/filiere/[filiereId]/FiliereProvider";
import { formatFullDate, formatTime } from "@/lib/date";
import cn from "classnames";
import { Eye, EyeOff, RotateCcw } from "react-feather";
import DiffDates from "./DiffDates";
import DiffFormateur from "./DiffFormateur";

export function ModuleHistoryUI({
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
  const { isVisible, toggleModificationVisibility, revertBackTo } =
    useFiliereStore();

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
          onClick={() => revertBackTo(modification.id)}
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
}
