"use client";
import { HydrationContext } from "@/components/AfterHydration";
import { useContext } from "react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

/**
 * 
 * Si on veut ajouter un lien vers une clé du localStorage
 * 1. Ajouter une constante de la clé (i.e. zoom_calendar_full)
 * 2. Ajouter une propriété dans defaultPlanningStorage (i.e.   [zoom_calendar_full]: 2 et dans le type PlanningStorage,
)
 * 
 */

export const zoom_calendar_full = "zoom_calendar_full";
export const zoom_calendar_filiere = "zoom_calendar_filiere";
export const zoom_calendar_formateur = "zoom_calendar_formateur";

interface PlanningStorage {
  [zoom_calendar_full]: number;
  [zoom_calendar_filiere]: number;
  [zoom_calendar_formateur]: number;
  set(partial: Partial<Omit<PlanningStorage, "set">>): void;
}

const defaultPlanningStorage = {
  [zoom_calendar_full]: 2,
  [zoom_calendar_filiere]: 5,
  [zoom_calendar_formateur]: 5,
};

const usePersistedStore = create<PlanningStorage>()(
  devtools(
    persist(
      (set) => ({
        ...defaultPlanningStorage,
        set(partial) {
          set(partial);
        },
      }),
      {
        name: "planningZooms", // needs to be Dynamic
        partialize: (state) => ({
          [zoom_calendar_full]: state[zoom_calendar_full],
          [zoom_calendar_filiere]: state[zoom_calendar_filiere],
          [zoom_calendar_formateur]: state[zoom_calendar_formateur],
        }),
      }
    )
  )
);

const useStore = ((selector, compare) => {
  const store = usePersistedStore(selector, compare);
  const { isHydrated } = useContext(HydrationContext);
  return isHydrated
    ? store
    : selector({
        ...defaultPlanningStorage,
        set() {
          /**/
        },
      });
}) as typeof usePersistedStore;
useStore.getState = usePersistedStore.getState;

export const useSpecialStore = (key: string) => {
  return useStore((s) => ({
    value: s[key as keyof PlanningStorage] as number,
    setValue: (nv: number) => s.set({ [key]: nv }),
  }));
};
