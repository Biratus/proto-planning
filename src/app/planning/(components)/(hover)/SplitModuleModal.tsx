"use client";
import FormateurSelect from "@/components/formulaires/FormateurSelect";
import { formatDateValue, parseDateValue } from "@/lib/date";
import { Formateur, Module } from "@/lib/types";
import { addDays } from "date-fns";
import { useCallback, useRef } from "react";
export const SplitModuleModalId = "splitModuleModal";

type SplitModuleModalProps<T extends Module> = {
  modules: T[] | null;
  setModules: (mod: T[]) => void;
  onClose: () => void;
  submit: (obj?: { split: Date; formateurs: Formateur[] }) => Promise<boolean>;
};

export default function SplitModuleModal<T extends Module>({
  modules,
  setModules,
  onClose,
  submit,
}: SplitModuleModalProps<T>) {
  const toggleRef = useRef<HTMLInputElement>(null);
  // const formateursOfModule = useRef<Formateur[]>([]);
  const splitDate = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    if (toggleRef.current && toggleRef.current.checked) {
      toggleRef.current.checked = false;
      onClose();
    }
  }, [onClose]);

  // if (module) {
  //   formateursOfModule.current = [module.formateur, module.formateur];
  // }

  const submitForm = async () => {
    // let [f1, f2] = formateursOfModule.current;
    // console.log({ date: parseDateValue(splitDate.current!.value), f1, f2 });
    const success = await submit();
    // const success = await submit({
    //   split: parseDateValue(splitDate.current!.value),
    //   formateurs: formateursOfModule.current,
    // });
    if (success) close();
  };

  const onSelectFirstFormateur = (f: Formateur) => {
    setModules([
      {
        ...modules![0],
        end: parseDateValue(splitDate.current!.value),
        formateur: f,
      },
      {
        ...modules![1],
        start: addDays(parseDateValue(splitDate.current!.value), 1),
      },
    ]);
  };
  const onSelectSecondFormateur = (f: Formateur) => {
    setModules([
      {
        ...modules![0],
        end: parseDateValue(splitDate.current!.value),
      },
      {
        ...modules![1],
        start: addDays(parseDateValue(splitDate.current!.value), 1),
        formateur: f,
      },
    ]);
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
        {modules?.length && (
          <label
            className="modal-box max-w-none w-2/5 h-full max-h-screen rounded-none"
            htmlFor=""
          >
            <h3 className="font-bold text-lg text-center">{modules[0].name}</h3>
            <div className="grid grid-cols-2 grid-rows-6 gap-2">
              <div className="form-control columns-1 row-start-1 row-end-3">
                <label className="label">
                  <span className="label-text">Date de début</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  disabled
                  value={formatDateValue(modules[0].start)}
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
                  defaultValue={formatDateValue(modules[0].start)}
                  min={formatDateValue(modules[0].start)}
                  max={formatDateValue(modules[1].end)}
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
                  value={formatDateValue(modules[1].end)}
                />
              </div>
              <div className="columns-2 flex px-4 items-start row-start-1 row-end-4 pt-9">
                <FormateurSelect
                  formateur={modules[0].formateur}
                  forModule={modules[0]}
                  setFormateur={onSelectFirstFormateur}
                />
              </div>
              <div className="columns-2 flex px-4 items-end row-start-4 row-end-7">
                <FormateurSelect
                  formateur={modules[1].formateur}
                  forModule={modules[1]}
                  setFormateur={onSelectSecondFormateur}
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
