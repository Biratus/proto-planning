"use client";

import Dropdown from "@/components/Dropdown";
import { changeURLParam } from "@/lib/navigation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FiliereView, FormateurView } from "./(calendar)/CalendarView";

const views = {
  [FiliereView.key]: FiliereView,
  [FormateurView.key]: FormateurView,
};

export default function ViewDropdown({ view: viewParam = FiliereView.key }) {
  const router = useRouter();
  const params = useSearchParams();
  const path = usePathname() || "";

  const view = views[viewParam];

  const viewActions = useMemo(
    () =>
      Object.keys(views).map((k) => {
        return {
          label: views[k].label,
          onClick: () =>
            router.replace(
              changeURLParam({ params, path, newParams: { view: k } })
            ),
          selected: view == views[k],
        };
      }),
    [view]
  );

  return <Dropdown label="Changer de vue" actions={viewActions} />;
}
