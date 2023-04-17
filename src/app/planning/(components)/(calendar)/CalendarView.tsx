import { fetchFiliere } from "@/lib/dataAccess";
import {
  CalendarView,
  Filiere,
  Formateur,
  FormateurWithModule,
  Module,
} from "@/lib/types";
import Link from "next/link";
import { useCallback } from "react";
import { FiliereDetailModalId } from "../(hover)/(modals)/FiliereModal";
import { setFocusedFiliere } from "./CalendarProvider";

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
    const fetchedFiliere = await fetchFiliere(filiere.nom);
    setFocusedFiliere(fetchedFiliere);
  }, [filiere]);
  return (
    <label
      className="flex h-full  cursor-pointer items-center  border-b border-blue-900  bg-blue-600 pl-1 hover:bg-blue-900"
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
  return (
    <RowLabel
      label={formateurSimple({ nom, prenom, mail })}
      href={`formateur/${mail}`}
    />
  );
}
function RowLabel({ href, label }: { href: string; label: string }) {
  return (
    <div className="flex h-full  items-center border-b  border-blue-900 bg-blue-600  pl-1 hover:bg-blue-900">
      <span className="truncate">
        <Link
          href={`planning/${href}`}
          prefetch={false}
          className="no-underline"
          style={{ color: "inherit" }}
        >
          {label}
        </Link>
      </span>
    </div>
  );
}
