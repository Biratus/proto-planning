import { JoursFeries } from "@/lib/calendar/joursFeries";
import {
  makeVacancesData,
  VacanceData,
  VacanceScolaire,
} from "@/lib/calendar/vacanceScolaire";
import { format } from "@/lib/date";
import { ModuleEvent } from "@/lib/types";
import { Interval } from "@/packages/calendar/types";
import { isWithinInterval } from "date-fns";
import { RefObject } from "react";
import { create } from "zustand";

export type SpecialDaysProps = {
  joursFeries: JoursFeries;
  vacances: VacanceScolaire[];
};
type CalendarStore = SpecialDaysProps & {
  isJoursFeries: (date: Date) => boolean;
  getJourFerie: (date: Date) => string;
  isVacances: (date: Date) => boolean;
  vacanceData: VacanceData[];
};
export const calendarStore = create<CalendarStore>((set, get) => ({
  joursFeries: {},
  vacances: [],
  vacanceData: [],
  isJoursFeries: (day: Date) =>
    get().joursFeries.hasOwnProperty(format(day, "yyyy-MM-dd")),
  getJourFerie: (day: Date) => get().joursFeries[format(day, "yyyy-MM-dd")],
  isVacances: (date: Date) =>
    get().vacances.some((v) => isWithinInterval(date, v)),
}));

export const setSpecialDays = ({ joursFeries, vacances }: SpecialDaysProps) =>
  calendarStore.setState({
    vacances,
    joursFeries,
    vacanceData: makeVacancesData(vacances),
  });

export const useJoursFeries = () =>
  calendarStore((state) => ({
    isJoursFeries: state.isJoursFeries,
    getJourFerie: state.getJourFerie,
  }));

export const useSpecialDays = () =>
  calendarStore((s) => ({
    isJoursFeries: s.isJoursFeries,
    getJourFerie: s.getJourFerie,
    isVacances: s.isVacances,
    vacanceData: s.vacanceData,
    getVacances: (d: Date) => {
      const vacances = s.vacances.filter((v) => isWithinInterval(d, v));
      return {
        labels: [...new Set(vacances.map((v) => v.label))],
        zones: [...new Set(vacances.map((v) => v.zone))],
      };
    },
    zones: new Set(s.vacances.map((v) => v.zone)),
  }));

/*
  ------ Hover
*/

interface CalendarHoverStore {
  popupMenu: RefObject<HTMLUListElement> | null;
  anchor: HTMLElement | null;
  focus: ModuleEvent | null;
  tempFocus: ModuleEvent[];
  openOverlapUI: (mod: ModuleEvent, ref: HTMLElement) => void;
  filiereFocus: string;
}

const initialHoverProps = {
  anchor: null,
  focus: null,
  tempFocus: [],
  filiereFocus: "",
};

const calendarHoverStore = create<CalendarHoverStore>((set, get) => ({
  ...initialHoverProps,
  popupMenu: null,
  openOverlapUI: (mod: ModuleEvent, ref: HTMLElement) =>
    set({ anchor: ref, focus: mod }),
}));
export const setPopUpMenu = (ref: RefObject<HTMLUListElement>) =>
  calendarHoverStore.setState({ popupMenu: ref });

export const resetHoverProps = () => {
  calendarHoverStore.setState({ ...initialHoverProps });
};

export const useFocusModule = () =>
  calendarHoverStore((state) => ({
    focus: state.focus,
    temps: state.tempFocus,
    setTempModule: (mod: ModuleEvent) =>
      calendarHoverStore.setState({ tempFocus: [mod, mod] }),
    setTempModules: (mods: ModuleEvent[]) => {
      console.log(mods);
      calendarHoverStore.setState({ tempFocus: mods });
    },
  }));
export const setFocusModule = (mod: ModuleEvent) =>
  calendarHoverStore.setState({
    focus: mod,
    tempFocus: [{ ...mod }, { ...mod }],
  });

export const useOverlapModuleUI = () =>
  calendarHoverStore((state) => ({
    focus: state.focus,
    anchor: state.anchor,
  }));

export const openOverlapUI = calendarHoverStore.getState().openOverlapUI;

export const useFocusedFiliere = () =>
  calendarHoverStore((state) => state.filiereFocus);

export const setFocusedFiliere = (filiere: string) =>
  calendarHoverStore.setState({ filiereFocus: filiere });

/*
  ------ Drag
*/

interface CalendarDragStore {
  draggedModule: ModuleEvent | null;
  dropTarget: { row: any; interval: Interval } | null;
}

const dragStore = create<CalendarDragStore>((set, get) => ({
  draggedModule: null,
  dropTarget: null,
}));

export const setDraggedModule = (mod: ModuleEvent) =>
  dragStore.setState({ draggedModule: mod });

export const getDraggedModule = () => dragStore((s) => s.draggedModule);

export const useDropTarget = () => ({
  draggedModule: dragStore((s) => s.draggedModule),
  dropTarget: dragStore((s) => s.dropTarget),
  setDropTarget: (interval: Interval, row?: any) =>
    dragStore.setState({ dropTarget: { interval, row } }),
  isDropTarget: (day: Date) =>
    dragStore.getState().dropTarget &&
    isWithinInterval(day, dragStore.getState().dropTarget!.interval),
  cleanDropTarget: () => {
    dragStore.setState({ dropTarget: null });
  },
});
