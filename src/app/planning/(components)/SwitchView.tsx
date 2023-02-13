"use client";

import { changeURLParam } from "@/lib/navigation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";
import { FiliereView, FormateurView } from "./(calendar)/CalendarView";

export default function SwitchView({ view: viewParam = FiliereView.key }) {
  const router = useRouter();
  const params = useSearchParams();
  const path = usePathname() || "";

  const switchView = (evt: ChangeEvent<HTMLInputElement>) => {
    let newView = evt.target.checked ? FiliereView.key : FormateurView.key;
    router.replace(
      changeURLParam({ params, path, newParams: { view: newView } })
    );
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <label htmlFor="switchViewId">Formateurs</label>
      <input
        id="switchViewId"
        type="checkbox"
        className="toggle"
        checked={viewParam == FiliereView.key}
        onChange={switchView}
      />
      <label htmlFor="switchViewId">Filières</label>
    </div>
  );
}
