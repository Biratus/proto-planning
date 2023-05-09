import cn from "classnames";
import {
  displayViews,
  getSelectedView,
  useModuleEventDisplay,
} from "./(calendar)/CalendarProvider";

export default function DataDisplay() {
  const view = getSelectedView();
  const { get, set } = useModuleEventDisplay();
  return (
    <>
      <div className="mb-3 border-b border-primary text-xl text-primary">
        Affichage
      </div>
      <div className="flex gap-2 pl-3">
        {displayViews.map((v) => {
          return (
            <button
              key={v.label}
              className={cn({
                "btn-xs btn": true,
                "btn-disabled": Boolean(v.for) && v.for != view,
                "btn-primary": v.label == get,
              })}
              onClick={() => set(v.label)}
              disabled={Boolean(v.for) && v.for != view}
            >
              {v.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
