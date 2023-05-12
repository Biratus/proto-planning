"use client";
import { formatFullPrettyDate } from "@/lib/date";
import { ModuleModification } from "@/lib/history";
import { RefObject, useRef } from "react";
import { useFiliereStore } from "./FiliereProvider";

const dummyRevertTarget: ModuleModification = {
  id: -1,
  module_id: -1,
  nom: "",
  before: { start: new Date(), end: new Date() },
  after: { start: new Date(), end: new Date() },
};
export default function ConfirmRevertModal({
  modalRef,
}: {
  modalRef: RefObject<{ open?: () => void; close?: () => void }>;
}) {
  const toggleRef = useRef<HTMLInputElement>(null);
  const { downgradeVersion, revertTarget = dummyRevertTarget } =
    useFiliereStore();

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
        id="ConfirmRevertModalId"
        className="modal-toggle"
        ref={toggleRef}
      />
      <label htmlFor="ConfirmRevertModalId" className="modal cursor-pointer">
        <label className="modal-box relative max-w-fit" htmlFor="">
          <h3 className="mb-2 text-xl font-bold">
            Vous êtes sur le point de modifier le module suivant :
          </h3>
          <p className="mb-2 font-bold">{revertTarget.nom}</p>
          <p>Les modifications suivantes seront effectuées :</p>
          <p className="pl-4">
            Du{" "}
            <span className="font-bold">
              {formatFullPrettyDate(revertTarget.before.start)}
            </span>
          </p>
          <p className="pl-4">
            au{" "}
            <span className="font-bold">
              {formatFullPrettyDate(revertTarget.before.end)}
            </span>
          </p>
          <p className="pl-4">
            Animé par{" "}
            <span className="font-bold">
              {revertTarget.before.formateur
                ? `${revertTarget.before.formateur.prenom} ${revertTarget.before.formateur.nom}`
                : "N/A"}
            </span>
          </p>
          <div className="modal-action">
            <button
              className="btn-success btn"
              onClick={() => downgradeVersion(revertTarget.id)}
            >
              Confirmer
            </button>
            <label className="btn-outline btn" htmlFor="ConfirmRevertModalId">
              Annuler
            </label>
          </div>
        </label>
      </label>
    </>
  );
}
