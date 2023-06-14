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
export const zoom_calendar_formateur = "zoom_calendar_formateur";

export type PlanningStorage = {
  [zoom_calendar_full]: number;
  [zoom_calendar_formateur]: number;
};

const defaultPlanningStorage = {
  [zoom_calendar_full]: 2,
  [zoom_calendar_formateur]: 5,
};

type FullLocalStorage = PlanningStorage & {
  set(partial: Partial<Omit<FullLocalStorage, "set">>): void;
};

const defaultFullLocalStorage = { ...defaultPlanningStorage };

const usePersistedStore = create<FullLocalStorage>()(
  devtools(
    persist(
      (set) => ({
        ...defaultFullLocalStorage,
        set(partial) {
          set(partial);
        },
      }),
      {
        name: "localStorageValues",
        partialize: (state) => ({
          [zoom_calendar_full]: state[zoom_calendar_full],
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
        ...defaultFullLocalStorage,
        set() {
          /**/
        },
      });
}) as typeof usePersistedStore;
useStore.getState = usePersistedStore.getState;

export const usePlanningStore = (key: keyof PlanningStorage) => {
  return useStore((s) => ({
    value: s[key] as number,
    setValue: (nv: number) => s.set({ [key]: nv }),
  }));
};

export function useLocalStorageStore<T>(key: keyof FullLocalStorage) {
  return useStore((s) => ({
    value: s[key] as T,
    setValue: (nv: T) => s.set({ [key]: nv }),
  }));
}
