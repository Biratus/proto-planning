// "use client";
import CommonModal, { ModalRef } from "@/components/CommonModal";
import FormateurSelect from "@/components/formulaires/FormateurSelect";
import { formatDateValue, parseDateValue } from "@/lib/date";
import { Formateur, Module } from "@/lib/types";
import { addDays } from "date-fns";
import { useCallback, useRef } from "react";
import ModuleTitle from "./ModuleTitle";
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
  const splitDate = useRef<HTMLInputElement>(null);

  const modalRef = useRef<ModalRef>({});

  const close = useCallback(() => {
    if (!modalRef.current?.isClosed!()) {
      modalRef.current!.close!();
      onClose();
    }
  }, [onClose]);

  const submitForm = async () => {
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
    <CommonModal inputId={SplitModuleModalId} modalRef={modalRef}>
      {modules?.length && (
        <>
          <ModuleTitle
            name={modules[0].nom}
            filiere={modules[0].filiere.nom}
            backButton={SplitModuleModalId}
          />

          <div className="grid grid-cols-2 grid-rows-6 gap-2">
            <div className="form-control row-start-1 row-end-3 columns-1">
              <label className="label">
                <span className="label-text">Date de début</span>
              </label>
              <input
                type="date"
                className="input-bordered input"
                disabled
                value={formatDateValue(modules[0].start)}
              />
            </div>
            <div className="form-control row-start-3 row-end-5 columns-1">
              <label className="label">
                <span className="label-text">Date de coupure</span>
              </label>
              <input
                type="date"
                className="input-bordered input"
                ref={splitDate}
                defaultValue={formatDateValue(modules[0].start)}
                min={formatDateValue(modules[0].start)}
                max={formatDateValue(modules[1].end)}
              />
            </div>
            <div className="form-control row-start-5 row-end-7 columns-1">
              <label className="label">
                <span className="label-text">Date de fin</span>
              </label>
              <input
                type="date"
                className="input-bordered input"
                disabled
                value={formatDateValue(modules[1].end)}
              />
            </div>
            <div className="row-start-1 row-end-4 flex columns-2 items-start px-4 pt-9">
              <FormateurSelect
                formateur={modules[0].formateur}
                forModule={modules[0]}
                setFormateur={onSelectFirstFormateur}
              />
            </div>
            <div className="row-start-4 row-end-7 flex columns-2 items-end px-4">
              <FormateurSelect
                formateur={modules[1].formateur}
                forModule={modules[1]}
                setFormateur={onSelectSecondFormateur}
              />
            </div>
          </div>
          <div className="modal-action w-full items-start">
            <button className="btn-success btn" onClick={submitForm}>
              Modifier
            </button>
          </div>
        </>
      )}
    </CommonModal>
  );
}
