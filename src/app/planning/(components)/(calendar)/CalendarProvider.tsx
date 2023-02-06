import { JoursFeries } from "@/lib/calendar";
import { format } from "@/lib/date";
import { Module } from "@/lib/types";
import { create } from "zustand";
const hoverElementsInit = {
  anchorEl: null,
  switchModal: false,
  splitModal: false,
  module: null,
  overlapDisplay: false,
  menuOpen: false,
};

type CalendarStore = {
  joursFeries: JoursFeries;
  isJoursFeries: (date: Date) => boolean;
  getJourFerie: (date: Date) => string;
  openMenu: () => void;
};

export const calendarStore = create<CalendarStore>((set, get) => ({
  joursFeries: {},
  isJoursFeries: (day: Date) =>
    get().joursFeries.hasOwnProperty(format(day, "yyyy-MM-dd")),
  getJourFerie: (day: Date) => get().joursFeries[format(day, "yyyy-MM-dd")],
  openMenu: () => {},
}));

export const setJoursFeries = (joursFeries: JoursFeries) =>
  calendarStore.setState((state) => (state.joursFeries = joursFeries)); // ServerSide
// (calendarStore().joursFeries = joursFeries); //ClientSide

export const useJoursFeries = () =>
  calendarStore((state) => ({
    isJoursFeries: state.isJoursFeries,
    getJourFerie: state.getJourFerie,
  }));

/*
  ------ Hover
*/

type CalendarHoverStore = {
  menuOpen: boolean;
  anchor: HTMLElement | null;
  focus: Module | null;
  openMenu: (mod: Module, ref: HTMLElement) => void;
  closeMenu: () => void;

  // Panel
  switchFormateurPanelRef: React.RefObject<HTMLInputElement> | null;
};

const initialHoverProps = {
  menuOpen: false,
  anchor: null,
  focus: null,
};

const calendarHoverStore = create<CalendarHoverStore>((set) => ({
  ...initialHoverProps,
  switchFormateurPanelRef: null,
  openMenu: (mod: Module, ref: HTMLElement) =>
    set({ menuOpen: true, anchor: ref, focus: mod }),
  closeMenu: () => set({ menuOpen: false, anchor: null }),
}));

export const resetHoverProps = () => {
  calendarHoverStore.setState((state) => ({ ...initialHoverProps }));
  closeSwitchPanel();
};

export const usePopUpMenuProps = () =>
  calendarHoverStore((state) => ({
    menuOpen: state.menuOpen,
    anchor: state.anchor,
  }));

export const useFocusModule = () => calendarHoverStore((state) => state.focus);
export const useHoverActions = () =>
  calendarHoverStore((state) => ({
    openMenu: state.openMenu,
    closeMenu: state.closeMenu,
  }));
export const setSwitchPanel = (element: React.RefObject<HTMLInputElement>) => {
  // calendarHoverStore.setState({ switchFormateurPanelRef: element });// ServerSide
  calendarHoverStore().switchFormateurPanelRef = element; //ClientSide
};

export const closeSwitchPanel = () =>
  (calendarHoverStore.getState().switchFormateurPanelRef!.current!.checked =
    false);
