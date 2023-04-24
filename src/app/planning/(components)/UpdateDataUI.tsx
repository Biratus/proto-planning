import { formatFullPrettyDate } from "@/lib/date";
import { Module } from "@/lib/types";
import { isSameDay } from "date-fns";
import { Check, MoreHorizontal, X } from "react-feather";

export default function UpdateDataUI({
  modify,
  abort,
  originalData,
  tempData,
}: {
  modify: () => void;
  abort: (modId?: number) => void;
  originalData: Map<number, Module>;
  tempData: Map<number, Module>;
}) {
  return (
    <div className="flex items-center gap-4 rounded border border-slate-900 p-4">
      {/* The button to open modal */}
      <label htmlFor="history-modal" className="btn space-x-2">
        Modification <MoreHorizontal />
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="history-modal" className="modal-toggle" />
      <label htmlFor="history-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className="text-center text-lg font-bold">
            Modification en cours
          </div>
          <div className="flex justify-center">
            <button className={`btn-success btn-sm btn`} onClick={modify}>
              Valider <Check />
            </button>
            <button className={`btn-error btn-sm btn`} onClick={() => abort}>
              Annuler <X />
            </button>
          </div>
          <div>
            {Array.from(tempData.values()).map((mod) => (
              <ModuleHistory
                key={mod.id}
                original={originalData.get(mod.id)!}
                current={mod}
                deleteEntry={() => abort(mod.id)}
              />
            ))}
          </div>
        </label>
      </label>
      <button className={`btn-success btn`} onClick={modify}>
        <Check />
      </button>
      <button className={`btn-error btn`} onClick={() => abort()}>
        <X />
      </button>
    </div>
  );
}

function ModuleHistory({
  original,
  current,
  deleteEntry,
}: {
  original: Module;
  current: Module;
  deleteEntry: () => void;
}) {
  const diffDates =
    !isSameDay(original.start, current.start) ||
    !isSameDay(original.end, current.end);

  const diffFormateur =
    (original.formateur && !current.formateur) ||
    (!original.formateur && current.formateur) ||
    original.formateur?.mail != current.formateur?.mail;
  return (
    <div className="mt-2">
      <div className="space-x-2">
        <span className="text-lg font-bold">{original.nom}</span>
        <button className={`btn-error btn-sm btn`} onClick={deleteEntry}>
          <X />
        </button>
      </div>
      {diffDates && <DiffDates original={original} current={current} />}
      {diffFormateur && <DiffFormateur original={original} current={current} />}
    </div>
  );
}
function DiffFormateur({
  original,
  current,
}: {
  original: Module;
  current: Module;
}) {
  const originalText = original.formateur
    ? `${original.formateur.nom} ${original.formateur.prenom}`
    : "N/A";
  const currentText = current.formateur
    ? `${current.formateur.nom} ${current.formateur.prenom}`
    : "N/A";
  return (
    <div>
      {originalText} &rarr; {currentText}
    </div>
  );
}

function DiffDates({
  original,
  current,
}: {
  original: Module;
  current: Module;
}) {
  return (
    <div>
      <div>
        {formatFullPrettyDate(original.start)} &rarr;{" "}
        {formatFullPrettyDate(original.end)}
      </div>
      <div className="font-bold">
        {formatFullPrettyDate(current.start)} &rarr;{" "}
        {formatFullPrettyDate(current.end)}
      </div>
    </div>
  );
}
