import AsyncButton from "@/components/AsyncButton";
import DiffDates from "@/components/history/DiffDates";
import DiffFormateur from "@/components/history/DiffFormateur";
import { Module } from "@/lib/types";
import { isSameDay } from "date-fns";
import { useCallback, useRef, useState } from "react";
import { Check, MoreHorizontal, X } from "react-feather";

export default function UpdateDataUI({
  modify,
  abort,
  originalData,
  tempData,
}: {
  modify: () => Promise<void>;
  abort: (modId?: number) => void;
  originalData: Map<number, Module>;
  tempData: Map<number, Module>;
}) {
  const modalRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const confirm = useCallback(async () => {
    try {
      await modify();
      modalRef.current!.checked = false;
    } catch (e: any) {
      modalRef.current!.checked = true;
      setErrorMessage(e.message);
    }
  }, [modify]);

  return (
    <div className="flex items-center gap-4 rounded border border-slate-900 p-4">
      {/* The button to open modal */}
      <label htmlFor="current-history-modal" className="btn space-x-2">
        Modification <MoreHorizontal />
      </label>

      {/* Put this part before </body> tag */}
      <input
        type="checkbox"
        id="current-history-modal"
        className="modal-toggle"
        ref={modalRef}
      />
      <label htmlFor="current-history-modal" className="modal cursor-pointer">
        <label className="modal-box relative max-w-fit" htmlFor="">
          <div className="text-center text-lg font-bold">
            Modification en cours
          </div>
          <div className="mb-3 flex justify-center gap-3">
            <AsyncButton
              className={`btn-success`}
              size="sm"
              asyncFunction={confirm}
            >
              Confirmer <Check />
            </AsyncButton>
            <button className={`btn-error btn-sm btn`} onClick={() => abort()}>
              Annuler <X />
            </button>
          </div>
          {errorMessage && (
            <div className="mb-3 text-error">{errorMessage}</div>
          )}
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
      <AsyncButton className={`btn-success`} asyncFunction={confirm}>
        <Check />
      </AsyncButton>
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
    <div className="group flex items-center gap-2">
      <div>
        <div className="font-bold">{original.nom}</div>
        <div className="pl-3">
          {diffDates && <DiffDates before={original} after={current} />}
          {diffFormateur && <DiffFormateur before={original} after={current} />}
        </div>
      </div>
      <div className="invisible group-hover:visible">
        <button
          title="Annuler cette modification"
          className={`btn-ghost btn`}
          onClick={deleteEntry}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
