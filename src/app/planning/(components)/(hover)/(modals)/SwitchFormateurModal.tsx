// "use client";
import CommonModal, { ModalRef } from "@/components/CommonModal";
import FormateurSelect from "@/components/formulaires/FormateurSelect";
import { Formateur, ModuleWithFiliere } from "@/lib/types";
import { useCallback, useRef } from "react";
import ModuleTitle from "./ModuleTitle";
export const SwitchFormateurModalId = "switchFormateurModal";

type SwitchFormateurModalProps<T extends ModuleWithFiliere> = {
  module: T | null;
  setModule: (mod: T) => void;
  onClose: () => void;
  submit: (mod?: T) => Promise<boolean>;
};

export default function SwitchFormateurModal<T extends ModuleWithFiliere>({
  module,
  setModule,
  onClose,
  submit,
}: SwitchFormateurModalProps<T>) {
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
    //   ...module!,
    //   formateur: formateurs.get(formateurRef.current!.mail)!,
    // });
    if (success) close();
  };

  const onSelectFormateur = (formateur: Formateur) => {
    setModule({
      ...module!,
      formateur,
    });
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
          <FormateurSelect
            formateur={module.formateur}
            forModule={module}
            setFormateur={onSelectFormateur}
          />
          <div className="modal-action w-full">
            <button className="btn btn-success" onClick={submitForm}>
              Modifier
            </button>
          </div>
        </>
      )}
    </CommonModal>
  );
}
