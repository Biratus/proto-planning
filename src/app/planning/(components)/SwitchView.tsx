"use client";

import { changeURLParam } from "@/lib/navigation";
import cn from "classnames";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiliereView, FormateurView } from "./(calendar)/CalendarView";

export default function SwitchView({ view: viewParam = FiliereView.key }) {
  const router = useRouter();
  const params = useSearchParams();
  const path = usePathname() || "";

  const setView = (view: string) =>
    router.push(changeURLParam({ params, path, newParams: { view } }));

  return (
    <div>
      <div className="mb-3 border-b border-primary text-xl text-primary">
        Données
      </div>
      <div className="flex gap-2 pl-3">
        <div
          className={cn({
            "btn-xs btn": true,
            "btn-primary": viewParam == FiliereView.key,
          })}
          onClick={() => setView(FiliereView.key)}
        >
          Filières
        </div>
        <div
          className={cn({
            "btn-xs btn": true,
            "btn-primary": viewParam == FormateurView.key,
          })}
          onClick={() => setView(FormateurView.key)}
        >
          Formateurs
        </div>
      </div>
    </div>
  );
}
