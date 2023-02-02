import { JoursFeries } from "@/lib/calendar";
import { format } from "@/lib/date";
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
  calendarStore.setState((state) => (state.joursFeries = joursFeries));

export const useJoursFeries = () =>
  calendarStore((state) => ({
    isJoursFeries: state.isJoursFeries,
    getJourFerie: state.getJourFerie,
  }));
export const useCalendarMenu = () => calendarStore((state) => state.openMenu);
