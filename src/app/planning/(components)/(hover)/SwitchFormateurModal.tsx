"use client";
import FormateurSelect from "@/components/formulaires/FormateurSelect";
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
  const toggleRef = useRef<HTMLInputElement>(null);

  const formateurRef = useRef<Formateur | null>(null);
  const close = useCallback(() => {
    if (toggleRef.current && toggleRef.current.checked) {
      toggleRef.current.checked = false;
      onClose();
    }
  }, [onClose]);

  if (module) formateurRef.current = module.formateur;

  const submitForm = async () => {
    const success = await submit({
      ...module!,
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
      <label htmlFor={SwitchFormateurModalId} className="modal justify-end">
        {module && (
          <label
            className="modal-box max-w-none w-2/5 h-full max-h-screen rounded-none"
            // ref={modalRef}
            htmlFor=""
          >
            <h3 className="font-bold text-lg text-center">{module.name}</h3>
            <div>Filière :{module.filiere}</div>
            <div>Début : {formatFullPrettyDate(module.start)}</div>
            <div>Fin : {formatFullPrettyDate(module.end)}</div>
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
          </label>
        )}
      </label>
    </>
  );
}
