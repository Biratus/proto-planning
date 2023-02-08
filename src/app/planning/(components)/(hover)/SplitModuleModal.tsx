"use client";
import FormateurSelect from "@/components/formulaires/FormateurSelect";
import { formatDateValue, parseDateValue } from "@/lib/date";
import { Formateur, Module } from "@/lib/types";
import { useCallback, useRef } from "react";
export const SplitModuleModalId = "splitModuleModal";

type SplitModuleModalProps = {
  module: Module | null;
  onClose: () => void;
  submit: (obj: { split: Date; formateurs: Formateur[] }) => Promise<boolean>;
};

export default function SplitModuleModal({
  module,
  onClose,
  submit,
}: SplitModuleModalProps) {
  const toggleRef = useRef<HTMLInputElement>(null);
  const formateursOfModule = useRef<Formateur[]>([]);
  const splitDate = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    if (toggleRef.current && toggleRef.current.checked) {
      toggleRef.current.checked = false;
      onClose();
    }
  }, [onClose]);

  if (module) {
    formateursOfModule.current = [module.formateur, module.formateur];
  }

  const submitForm = async () => {
    let [f1, f2] = formateursOfModule.current;
    console.log({ date: parseDateValue(splitDate.current!.value), f1, f2 });
    const success = await submit({
      split: parseDateValue(splitDate.current!.value),
      formateurs: formateursOfModule.current,
    });
    if (success) close();
  };

  const onSelectFirstFormateur = (f: Formateur) => {
    formateursOfModule.current[0] = f;
  };
  const onSelectSecondFormateur = (f: Formateur) => {
    formateursOfModule.current[1] = f;
  };

  return (
    <>
      <input
        ref={toggleRef}
        type="checkbox"
        id={SplitModuleModalId}
        className="modal-toggle"
      />
      <label htmlFor={SplitModuleModalId} className="modal justify-end">
        {module && (
          <label
            className="modal-box max-w-none w-2/5 h-full max-h-screen rounded-none"
            htmlFor=""
          >
            <h3 className="font-bold text-lg text-center">{module.name}</h3>
            <div className="grid grid-cols-2 grid-rows-6 gap-2">
              <div className="form-control columns-1 row-start-1 row-end-3">
                <label className="label">
                  <span className="label-text">Date de début</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  disabled
                  value={formatDateValue(module.start)}
                />
              </div>
              <div className="form-control columns-1 row-start-3 row-end-5">
                <label className="label">
                  <span className="label-text">Date de coupure</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  ref={splitDate}
                  defaultValue={formatDateValue(module.start)}
                  min={formatDateValue(module.start)}
                  max={formatDateValue(module.end)}
                />
              </div>
              <div className="form-control columns-1 row-start-5 row-end-7">
                <label className="label">
                  <span className="label-text">Date de fin</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  disabled
                  value={formatDateValue(module.end)}
                />
              </div>
              <div className="columns-2 flex px-4 items-start row-start-1 row-end-4 pt-9">
                <FormateurSelect
                  formateur={module.formateur}
                  forModule={module}
                  onSelect={onSelectFirstFormateur}
                />
              </div>
              <div className="columns-2 flex px-4 items-end row-start-4 row-end-7">
                <FormateurSelect
                  formateur={module.formateur}
                  forModule={module}
                  onSelect={onSelectSecondFormateur}
                />
              </div>
            </div>
            <div className="modal-action w-full items-start">
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
