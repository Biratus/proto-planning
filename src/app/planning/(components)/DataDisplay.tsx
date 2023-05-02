import { ModuleEvent } from "@/lib/types";
import cn from "classnames";

export type DisplayView = {
  label: string;
  print: (mod: ModuleEvent) => string;
  for?: string;
  selected: boolean;
  disabled: boolean;
};

type DataDisplayProps = {
  views: DisplayView[];
  setSelected: (view: DisplayView) => void;
};

export default function DataDisplay({ views, setSelected }: DataDisplayProps) {
  return (
    <>
      <div className="mb-3 border-b border-primary text-xl text-primary">
        Affichage
      </div>
      <div className="flex gap-2 pl-3">
        {views.map((v) => {
          return (
            <button
              key={v.label}
              className={cn({
                "btn-xs btn": true,
                "btn-primary": v.selected,
                "btn-disabled": v.disabled,
              })}
              onClick={() => setSelected(v)}
              disabled={v.disabled}
            >
              {v.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
