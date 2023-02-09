import { CalendarView, Formateur } from "@/lib/types";
import Link from "next/link";

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
  return <RowLabel label={filiere} href={`filiere/${filiere}`} />;
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
    <div className="flex items-center  bg-blue-600 pl-1  hover:bg-blue-900 h-full  border-b border-blue-900">
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
