import { JoursFeries } from "@/lib/calendar/joursFeries";
import { format } from "@/lib/date";
import { Filiere, ModuleEvent } from "@/lib/types";
import { Interval } from "@/packages/calendar/types";
import { isWithinInterval } from "date-fns";
import { create } from "zustand";

/*
  ------ Data
*/

/*
  ------ SpecialDays
*/

export type SpecialDaysProps = {
  joursFeries: JoursFeries;
};
type CalendarStore = SpecialDaysProps & {
  isJoursFeries: (date: Date) => boolean;
  getJourFerie: (date: Date) => string;
};
export const calendarStore = create<CalendarStore>((set, get) => ({
  joursFeries: {},
  vacances: [],
  vacanceData: [],
  isJoursFeries: (day: Date) =>
    get().joursFeries.hasOwnProperty(format(day, "yyyy-MM-dd")),
  getJourFerie: (day: Date) => get().joursFeries[format(day, "yyyy-MM-dd")],
}));

export const setSpecialDays = ({ joursFeries }: SpecialDaysProps) =>
  calendarStore.setState({
    joursFeries,
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
  }));

/*
  ------ Hover
*/

interface CalendarHoverStore {
  anchor: HTMLElement | null;
  focus: ModuleEvent | null;
  overlapFocus: ModuleEvent | null;
  tempFocus: ModuleEvent[];
  openOverlapUI: (mod: ModuleEvent, ref: HTMLElement) => void;
  filiereFocus: Filiere | null;
}

const initialHoverProps = {
  anchor: null,
  focus: null,
  overlapFocus: null,
  tempFocus: [],
  filiereFocus: null,
};

const calendarHoverStore = create<CalendarHoverStore>((set, get) => ({
  ...initialHoverProps,
  openOverlapUI: (mod: ModuleEvent, ref: HTMLElement) =>
    set({ anchor: ref, overlapFocus: mod }),
}));

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
    focus: state.overlapFocus,
    anchor: state.anchor,
  }));

export const openOverlapUI = calendarHoverStore.getState().openOverlapUI;

export const useFocusedFiliere = () =>
  calendarHoverStore((state) => state.filiereFocus);

export const setFocusedFiliere = (filiere: Filiere) =>
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
