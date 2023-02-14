"use client";
import CommonModal, { ModalRef } from "@/components/CommonModal";
import { formatFullDate } from "@/lib/date";
import { ModuleEvent } from "@/lib/types";
import { ReactNode, useMemo, useRef } from "react";
import { MoreVertical, User, Users } from "react-feather";
import { useFocusModule } from "../../(calendar)/CalendarProvider";
import ModuleTitle from "./ModuleTitle";
import { SplitModuleModalId } from "./SplitModuleModal";
import { SwitchFormateurModalId } from "./SwitchFormateurModal";
export const ModuleDetailModalId = "moduleDetailModalId";

const defaultModule: ModuleEvent = {
  id: "",
  name: "",
  start: new Date(),
  end: new Date(),
  theme: "",
  filiere: "",
  formateur: { nom: "", prenom: "", mail: "" },
  duration: 0,
};

export default function ModuleModal() {
  const { focus, temps } = useFocusModule();

  const { name, start, end, formateur, filiere, duration } =
    focus || defaultModule;

  const modalRef = useRef<ModalRef>({});

  const dateActions = useMemo(
    () => [
      {
        labelId: SplitModuleModalId,
        content: (
          <>
            <Users className="mr-1" />
            Scinder le module
          </>
        ),
      },
    ],
    []
  );

  const formateurActions = useMemo(
    () => [
      {
        labelId: SwitchFormateurModalId,
        content: (
          <>
            <User className="mr-1" />
            Modifier le formateur
          </>
        ),
      },
    ],
    []
  );

  return (
    <CommonModal inputId={ModuleDetailModalId} modalRef={modalRef}>
      {/* Info basiques */}
      <ModuleTitle name={name} filiere={filiere} />
      {/* Dates */}
      <div className="flex flex-row items-center gap-4">
        <span>
          Du <span className="font-bold">{formatFullDate(start)}</span> au{" "}
          <span className="font-bold">{formatFullDate(end)}</span> - {duration}{" "}
          jours
        </span>
        {/* Actions */}
        <MoreActions actions={dateActions} />
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-row gap-2">
          Formateur : <User /> {formateur.prenom} {formateur.nom}
        </div>
        <MoreActions actions={formateurActions} />
      </div>
    </CommonModal>
  );
}

function MoreActions({
  actions,
}: {
  actions: { labelId: string; content: ReactNode }[];
}) {
  return (
    <div className="dropdown-end dropdown">
      <label tabIndex={0} className="btn-ghost btn-circle btn">
        <div className="flex w-10 justify-center rounded-full">
          <MoreVertical />
        </div>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box menu-compact mt-3 w-52 border-base-300 bg-base-100 p-2 shadow"
      >
        {actions.map(({ labelId, content }, i) => (
          <li key={i}>
            <label htmlFor={labelId}>{content}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
