import AsyncButton from "@/components/AsyncButton";
import CommonModal, { ModalRef } from "@/components/CommonModal";
import FormateurSelect from "@/components/formulaires/FormateurSelect";
import { apiUpdateModule } from "@/lib/dataAccess";
import { Formateur, Module } from "@/lib/types";
import { useCallback, useRef, useState } from "react";
import ModuleTitle from "./ModuleTitle";
export const SwitchFormateurModalId = "switchFormateurModal";

export type SwitchFormateurModalProps<T extends Module> = {
  module: T;
  // setModule: (mod: T) => void;
  // onClose: () => void;
  onSuccess: (formateur: Formateur | null) => void;
};

export default function SwitchFormateurModal<T extends Module>({
  module,
  // setModule,
  onSuccess,
}: SwitchFormateurModalProps<T>) {
  const modalRef = useRef<ModalRef>({});
  const switchFormateurRef = useRef<Formateur>(module.formateur || null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const close = useCallback(() => {
    if (!modalRef.current?.isClosed!()) {
      modalRef.current!.close!();
    }
  }, []);

  const submitForm = async () => {
    setErrorMessage(null);
    const newModule: T = { ...module, formateur: switchFormateurRef.current };
    const response = await apiUpdateModule(newModule);
    if (response.updated) {
      onSuccess(switchFormateurRef.current);
      close();
    } else {
      setErrorMessage(response.errors[0].error);
    }
  };

  return (
    <CommonModal inputId={SwitchFormateurModalId} modalRef={modalRef}>
      {module && (
        <>
          <ModuleTitle
            name={module.nom}
            filiere={module.filiere.nom}
            backButton={SwitchFormateurModalId}
          />
          {/* <div>Début : {formatFullPrettyDate(module.start)}</div>
          <div>Fin : {formatFullPrettyDate(module.end)}</div>
          <div>{JSON.stringify(module.formateur)}</div> */}
          {errorMessage && <div className="text-error">{errorMessage}</div>}
          <FormateurSelect
            formateurRef={switchFormateurRef}
            formateur={module.formateur || undefined}
            forModule={module}
          />
          <div className="modal-action w-full">
            <AsyncButton className="btn-success btn" asyncFunction={submitForm}>
              Modifier
            </AsyncButton>
          </div>
        </>
      )}
    </CommonModal>
  );
}
