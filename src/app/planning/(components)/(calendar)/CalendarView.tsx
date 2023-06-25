import { apiFetchFiliere } from "@/lib/dataAccess";
import {
  CalendarView,
  Filiere,
  Formateur,
  FormateurWithModule,
  Module,
} from "@/lib/types";
import cn from "classnames";
import Link from "next/link";
import { useCallback } from "react";
import { FiliereDetailModalId } from "../(hover)/(modals)/FiliereModal";
import { useDropTarget } from "../../(store)/dragStore";
import { setFocusedFiliere } from "../../(store)/hoverStore";

const formateurSimple = ({ nom, prenom, mail }: Formateur) =>
  `${nom} ${prenom} - ${mail}`;

export const FiliereView: CalendarView<Filiere & { modules: Module[] }> = {
  key: "filiere",
  label: "Filière",
  keyObject: ({ filiere }) => filiere,
  labelTitle: (f: Filiere) => f.nom,
  LabelComponent: FiliereLabel,
};

export const FormateurView: CalendarView<FormateurWithModule> = {
  key: "formateur",
  label: "Formateur",
  keyObject: ({ formateur }) => formateur,
  labelTitle: ({ nom, prenom, mail }) => `${nom} ${prenom} [${mail}]`,
  LabelComponent: FormateurLabel,
};
function FiliereLabel({ labelKey: filiere }: { labelKey: Filiere }) {
  const setFocus = useCallback(async () => {
    const fetchedFiliere = await apiFetchFiliere(filiere.nom);
    setFocusedFiliere(fetchedFiliere);
  }, [filiere]);

  const { dropTarget } = useDropTarget<Filiere>();
  return (
    <label
      className={cn(
        "flex h-full  cursor-pointer items-center  border-b border-blue-900  bg-blue-600 pl-1 hover:bg-blue-900",
        {
          "bg-amber-600": dropTarget && dropTarget.row.nom == filiere.nom,
        }
      )}
      htmlFor={FiliereDetailModalId}
      onClick={setFocus}
    >
      <span className="truncate">{filiere.nom}</span>
    </label>
  );
}
function FormateurLabel({
  labelKey: { nom, prenom, mail },
}: {
  labelKey: Formateur;
}) {
  const { dropTarget } = useDropTarget<Formateur>();

  return (
    <div
      className={cn(
        "flex h-full  items-center border-b  border-blue-900 bg-blue-600  pl-1 hover:bg-blue-900",
        {
          "bg-amber-600": dropTarget && dropTarget.row.mail == mail,
        }
      )}
    >
      <span className="truncate">
        <Link
          href={`planning/formateur/${mail}`}
          prefetch={false}
          className="no-underline"
          style={{ color: "inherit" }}
        >
          {formateurSimple({ nom, prenom, mail })}
        </Link>
      </span>
    </div>
  );
}
