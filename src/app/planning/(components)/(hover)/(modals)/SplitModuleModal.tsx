import AsyncButton from "@/components/AsyncButton";
import CommonModal, { ModalRef } from "@/components/CommonModal";
import FormateurSelect from "@/components/formulaires/FormateurSelect";
import { apiSplitModule } from "@/lib/dataAccess";
import { formatDateValue, parseDateValue } from "@/lib/date";
import { Formateur, Module } from "@/lib/types";
import { addDays } from "date-fns";
import { useCallback, useRef, useState } from "react";
import ModuleTitle from "./ModuleTitle";
export const SplitModuleModalId = "splitModuleModal";

type SplitModuleModalProps<T extends Module> = {
  module: T;
  onSuccess: (createdAndUpdate: T[]) => void;
};

export default function SplitModuleModal<T extends Module>({
  module,
  onSuccess,
}: SplitModuleModalProps<T>) {
  const splitDate = useRef<HTMLInputElement>(null);

  const modalRef = useRef<ModalRef>({});
  const firstFormateurRef = useRef<Formateur>(module.formateur || null);
  const secFormateurRef = useRef<Formateur>(module.formateur || null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const close = useCallback(() => {
    if (!modalRef.current?.isClosed!()) {
      modalRef.current!.close!();
    }
  }, []);

  const submitForm = async () => {
    setErrorMessage(null);
    const date = parseDateValue(splitDate.current!.value);
    const response = await apiSplitModule([
      { ...module, formateur: firstFormateurRef.current, end: date },
      {
        ...module,
        formateur: secFormateurRef.current,
        start: addDays(date, 1),
        id: undefined,
      },
    ]);
    if (!("error" in response)) {
      onSuccess(response as T[]);
      close();
    } else {
      setErrorMessage(response.error);
    }
  };

  return (
    <CommonModal inputId={SplitModuleModalId} modalRef={modalRef}>
      <ModuleTitle
        name={module.nom}
        filiere={module.filiere.nom}
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
            value={formatDateValue(module.start)}
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
            defaultValue={formatDateValue(module.start)}
            min={formatDateValue(module.start)}
            max={formatDateValue(module.end)}
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
            value={formatDateValue(module.end)}
          />
        </div>
        <div className="row-start-1 row-end-4 flex columns-2 items-start px-4 pt-9">
          <FormateurSelect
            formateur={module.formateur || undefined}
            forModule={module}
            formateurRef={firstFormateurRef}
          />
        </div>
        <div className="row-start-4 row-end-7 flex columns-2 items-end px-4">
          <FormateurSelect
            formateur={module.formateur || undefined}
            forModule={module}
            formateurRef={secFormateurRef}
          />
        </div>
      </div>
      {errorMessage && (
        <div className="mt-2 text-right text-error">{errorMessage}</div>
      )}
      <div className="modal-action w-full items-start">
        <AsyncButton className="btn-success btn" asyncFunction={submitForm}>
          Modifier
        </AsyncButton>
      </div>
    </CommonModal>
  );
}
