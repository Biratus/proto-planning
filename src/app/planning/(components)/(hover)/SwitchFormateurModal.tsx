"use client";
import FormateurSelect from "@/components/formulaires/FormateurSelect";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { formatFullPrettyDate } from "@/lib/date";
import { formateurs } from "@/lib/realData";
import { Formateur, Module } from "@/lib/types";
import { useCallback, useRef } from "react";
export const SwitchFormateurModalId = "switchFormateurModal";

type SwitchFormateurModalProps = {
  module: Module | null;
  onClose: () => void;
  submit: (mod?: Module) => Promise<boolean>;
};

export default function SwitchFormateurModal({
  module,
  onClose,
  submit,
}: SwitchFormateurModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLInputElement>(null);

  const formateurRef = useRef<Formateur | null>(null);
  const close = useCallback(() => {
    if (toggleRef.current && toggleRef.current.checked) {
      toggleRef.current.checked = false;
      onClose();
    }
  }, []);
  useOnClickOutside(modalRef, close);

  if (!module) return null;

  const { name, start, end, filiere } = module;
  formateurRef.current = module.formateur;

  const submitForm = async () => {
    const success = await submit({
      ...module,
      formateur: formateurs.get(formateurRef.current!.mail)!,
    });
    if (success) close();
  };

  const onSelectFormateur = (f: Formateur) => {
    formateurRef.current = f;
  };

  return (
    <>
      <input
        ref={toggleRef}
        type="checkbox"
        id={SwitchFormateurModalId}
        className="modal-toggle"
      />
      <div className="modal justify-end">
        <div
          className="modal-box max-w-none w-2/5 h-full max-h-screen rounded-none"
          ref={modalRef}
        >
          <h3 className="font-bold text-lg">{name}</h3>
          <div>Filière :{filiere}</div>
          <div>Début : {formatFullPrettyDate(start)}</div>
          <div>Fin : {formatFullPrettyDate(end)}</div>
          <div>{JSON.stringify(module.formateur)}</div>
          <FormateurSelect
            formateur={module.formateur}
            forModule={module}
            onSelect={onSelectFormateur}
          />
          <div className="modal-action w-full">
            <button className="btn btn-success" onClick={submitForm}>
              Modifier
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
