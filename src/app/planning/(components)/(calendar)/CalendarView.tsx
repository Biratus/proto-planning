import { CalendarView, Formateur } from "@/lib/types";
import Link from "next/link";
import { useCallback } from "react";
import { FiliereDetailModalId } from "../(modals)/filiere";
import { setFocusedFiliere } from "./CalendarProvider";

const formateurSimple = ({ nom, prenom, mail }: Formateur) =>
  `${nom} ${prenom} - ${mail}`;

export const FiliereView: CalendarView<string> = {
  key: "filiere",
  label: "Filière",
  keyObject: ({ filiere }) => filiere,
  labelTitle: (f) => f,
  LabelComponent: FiliereLabel,
};

export const FormateurView: CalendarView<Formateur> = {
  key: "formateur",
  label: "Formateur",
  keyObject: ({ formateur }) => formateur,
  labelTitle: ({ nom, prenom, mail }) => `${nom} ${prenom} [${mail}]`,
  LabelComponent: FormateurLabel,
};
function FiliereLabel({ labelKey: filiere }: { labelKey: string }) {
  const setFocus = useCallback(() => {
    setFocusedFiliere(filiere);
  }, [filiere]);
  return (
    <label
      className="flex h-full  cursor-pointer items-center  border-b border-blue-900  bg-blue-600 pl-1 hover:bg-blue-900"
      htmlFor={FiliereDetailModalId}
      onClick={setFocus}
    >
      <span className="truncate">{filiere}</span>
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
