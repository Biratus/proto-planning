/*
  ------ Hover
*/

import { Filiere, ModuleEvent } from "@/lib/types";
import { create } from "zustand";

interface CalendarHoverStore {
  anchor: HTMLElement | null;
  focus: ModuleEvent | null;
  overlapFocus: ModuleEvent | null;
  openOverlapUI: (mod: ModuleEvent, ref: HTMLElement) => void;
  filiereFocus: Filiere | null;
}

const initialHoverProps = {
  anchor: null,
  focus: null,
  overlapFocus: null,
  filiereFocus: null,
};

const calendarHoverStore = create<CalendarHoverStore>((set, get) => ({
  ...initialHoverProps,
  openOverlapUI: (mod: ModuleEvent, ref: HTMLElement) =>
    set({ anchor: ref, overlapFocus: mod }),
}));

export const useFocusModule = () =>
  calendarHoverStore((state) => ({
    focus: state.focus,
  }));
export const setFocusModule = (mod: ModuleEvent) =>
  calendarHoverStore.setState({
    focus: mod,
  });

export const useOverlapModuleUI = () =>
  calendarHoverStore((state) => ({
    focus: state.overlapFocus,
    anchor: state.anchor,
  }));

export const openOverlapUI = calendarHoverStore.getState().openOverlapUI;

export const useFocusedFiliere = () =>
  calendarHoverStore((state) => state.filiereFocus);

export const setFocusedFiliere = (filiere: Filiere) =>
  calendarHoverStore.setState({ filiereFocus: filiere });
