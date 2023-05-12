import { Formateur } from "@/lib/types";
import cn from "classnames";

export default function DiffFormateur({
  before,
  after,
  className,
}: {
  before: { formateur?: Formateur | null };
  after: { formateur?: Formateur | null };
} & React.HTMLAttributes<HTMLElement>) {
  const beforeText = before.formateur
    ? `${before.formateur.nom} ${before.formateur.prenom}`
    : "N/A";
  const afterText = after.formateur
    ? `${after.formateur.nom} ${after.formateur.prenom}`
    : "N/A";
  return (
    <div
      className={cn({
        "group-hover:visible": beforeText == afterText,
        invisible: beforeText == afterText,
      })}
    >
      {beforeText} &rarr;{" "}
      <span
        className={cn(className, {
          "font-bold": beforeText != afterText,
        })}
      >
        {afterText}
      </span>
    </div>
  );
}
