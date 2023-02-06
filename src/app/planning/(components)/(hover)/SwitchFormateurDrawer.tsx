"use client";
import FormateurSelect from "@/components/formulaires/FormateurSelect";
import { formatFullPrettyDate } from "@/lib/date";
import { formateurs } from "@/lib/realData";
import { Formateur, Module } from "@/lib/types";
import { useRef } from "react";
export const SwitchFormateurDrawerId = "switchFormateurDraw";

type SwitchFormateurModalProps = {
  module: Module | null;
  onClose: () => void;
  submit: (mod?: Module) => Promise<boolean>;
};

export default function SwitchFormateurDrawer({
  module,
  onClose,
  submit,
}: SwitchFormateurModalProps) {
  const formateurRef = useRef<Formateur | null>(null);
  if (!module) return null;

  const { name, start, end, filiere } = module;
  formateurRef.current = module.formateur;

  const submitForm = async () => {
    const success = await submit({
      ...module,
      formateur: formateurs.get(formateurRef.current!.mail)!,
    });
  };

  const onSelectFormateur = (f: Formateur) => {
    formateurRef.current = f;
  };

  return (
    <div className="drawer-side top-0 w-screen h-screen">
      <label
        htmlFor={`${SwitchFormateurDrawerId}`}
        className="drawer-overlay"
        onClick={onClose}
      ></label>
      <div className="flex flex-col gap-3 bg-base-100 p-10 w-2/5">
        <div>Module : {name}</div>
        <div>Filière :{filiere}</div>
        <div>Début : {formatFullPrettyDate(start)}</div>
        <div>Fin : {formatFullPrettyDate(end)}</div>
        <div>{JSON.stringify(module.formateur)}</div>
        <FormateurSelect
          formateur={module.formateur}
          forModule={module}
          onSelect={onSelectFormateur}
        />
        <button className="btn btn-success" onClick={submitForm}>
          Modifier
        </button>
      </div>
    </div>
  );
}
