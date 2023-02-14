import { ArrowLeft } from "react-feather";

export default function ModuleTitle({
  name,
  filiere,
  backButton,
}: {
  name: string;
  filiere: string;
  backButton?: string;
}) {
  return (
    <div className="mb-8 flex items-center justify-center gap-3">
      {backButton && (
        <label
          htmlFor={backButton}
          className="absolute left-0 cursor-pointer pl-6"
        >
          <ArrowLeft />
        </label>
      )}
      <span className="text-2xl font-bold">
        {name}
        <div className="text-center text-xs">{filiere}</div>
      </span>
    </div>
  );
}
