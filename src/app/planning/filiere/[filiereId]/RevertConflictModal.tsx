import DiffDates from "@/components/history/DiffDates";
import DiffFormateur from "@/components/history/DiffFormateur";
import { formatFullDate, formatTime } from "@/lib/date";
import { ModuleModification } from "@/lib/history";
import { RefObject, useRef } from "react";
import { useFiliereStore } from "./FiliereProvider";

export default function RevertConflictModal({
  modalRef,
}: {
  modalRef: RefObject<{ open?: () => void; close?: () => void }>;
}) {
  const { revertConflicts, revertBackTo, askConfirm } = useFiliereStore();
  const toggleRef = useRef<HTMLInputElement>(null);

  modalRef.current!.close = () => {
    toggleRef.current!.checked = false;
  };

  modalRef.current!.open = () => {
    toggleRef.current!.checked = true;
  };

  return (
    <>
      <input
        type="checkbox"
        id="RevertConflictModalId"
        className="modal-toggle"
        ref={toggleRef}
      />
      <label htmlFor="RevertConflictModalId" className="modal cursor-pointer">
        <label className="modal-box relative max-w-fit" htmlFor="">
          <h3 className="text-xl font-bold">Attention !</h3>
          <p className="py-4">
            Vous essayez de revenir à une version d&apos;un module sur lequel il
            y a eu des modifications entre temps:
          </p>
          <ul
            className="steps steps-vertical w-11/12"
            style={{ gridAutoRows: "auto" }}
          >
            {revertConflicts.map((history, i) => (
              <li
                className="step-neutral step"
                data-content={i == revertConflicts.length - 1 ? "●" : "x"}
                key={i}
              >
                <div className="mb-5">
                  <div className="text-left">
                    <span className="italic">
                      Depuis le{" "}
                      {formatFullDate(new Date(history.modified_datetime))} à{" "}
                      {formatTime(new Date(history.modified_datetime))} par
                      Clément Birette
                    </span>
                    <div className="flex flex-col gap-2">
                      <Modification modification={history} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="modal-action">
            <button
              className="btn-success btn"
              onClick={() =>
                askConfirm(revertConflicts[revertConflicts.length - 1].id)
              }
            >
              Continuer
            </button>
            <label className="btn-outline btn" htmlFor="RevertConflictModalId">
              Annuler
            </label>
          </div>
        </label>
      </label>
    </>
  );
}
function Modification({ modification }: { modification: ModuleModification }) {
  return (
    <div className="group flex items-center gap-2">
      <div>
        <div className="font-bold">{modification.nom}</div>
        <div className="pl-3">
          <DiffDates before={modification.before} after={modification.after} />
          <DiffFormateur
            before={modification.before}
            after={modification.after}
          />
        </div>
      </div>
    </div>
  );
}
