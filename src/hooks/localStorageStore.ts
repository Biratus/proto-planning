"use client";
import { HydrationContext } from "@/components/AfterHydration";
import { useContext } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 
 * Si on veut ajouter un lien vers une clé du localStorage
 * 1. Ajouter une constante de la clé (i.e. zoom_calendar_full)
 * 2. Ajouterune propriété dans allStorages (i.e.   [zoom_calendar_full]: useLocalStorage(zoom_calendar_full, 2),
)
 * 
 */

export const zoom_calendar_full = "zoom_calendar_full";
export const zoom_calendar_filiere = "zoom_calendar_filiere";
export const zoom_calendar_formateur = "zoom_calendar_formateur";

// const emptyState = (set) => ({
//   value: null,
//   setValue: (newValue) => set({ value: newValue }),
// });
interface LocalStorageProps<T> {
  value: T;
}
interface LocalStorageState<T> extends LocalStorageProps<T> {
  setValue: (newValue: T) => void;
}

const useLocalStorage = (key: string, initialValue: any) =>
  create<LocalStorageState<typeof initialValue>>()(
    persist(
      (set) => ({
        value: initialValue,
        setValue: (newValue) => set({ value: newValue }),
      }),
      {
        name: key,
        partialize: (state) => ({ value: state.value }),
      }
    )
  );
const allStorages = new Map([
  [zoom_calendar_full, useLocalStorage(zoom_calendar_full, 2)],
  [zoom_calendar_filiere, useLocalStorage(zoom_calendar_filiere, 5)],
  [zoom_calendar_formateur, useLocalStorage(zoom_calendar_formateur, 5)],
]);
// const allStorages = {
//   [zoom_calendar_full]: useLocalStorage(zoom_calendar_full, 2),
//   [zoom_calendar_filiere]: useLocalStorage(zoom_calendar_filiere, 5),
//   [zoom_calendar_formateur]: useLocalStorage(zoom_calendar_formateur, 5),
// };

export const useLocalStorageAfterHydration =
  (storageKey: string) => (selector?: any, compare?: any) => {
    const { isHydrated } = useContext(HydrationContext);
    if (!allStorages.has(storageKey))
      throw new Error(`${storageKey} n'est pas défini dans localStorageStore`);
    const store = allStorages.get(storageKey)!(selector, compare);

    return isHydrated
      ? store
      : selector((set: any) => ({
          value: null,
          setValue: (newValue: any) => set({ value: newValue }),
        }));
  };
