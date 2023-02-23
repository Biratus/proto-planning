import { JoursFeries } from "@/lib/calendar";
import { format } from "@/lib/date";
import { ModuleEvent } from "@/lib/types";
import { Interval } from "@/packages/calendar/types";
import { isWithinInterval } from "date-fns";
import { RefObject } from "react";
import { create } from "zustand";

type CalendarStore = {
  joursFeries: JoursFeries;
  isJoursFeries: (date: Date) => boolean;
  getJourFerie: (date: Date) => string;
};

export const calendarStore = create<CalendarStore>((set, get) => ({
  joursFeries: {},
  isJoursFeries: (day: Date) =>
    get().joursFeries.hasOwnProperty(format(day, "yyyy-MM-dd")),
  getJourFerie: (day: Date) => get().joursFeries[format(day, "yyyy-MM-dd")],
}));

export const setJoursFeries = (joursFeries: JoursFeries) =>
  calendarStore.setState({ joursFeries });

export const useJoursFeries = () =>
  calendarStore((state) => ({
    isJoursFeries: state.isJoursFeries,
    getJourFerie: state.getJourFerie,
  }));

/*
  ------ Hover
*/

interface CalendarHoverStore {
  popupMenu: RefObject<HTMLUListElement> | null;
  anchor: HTMLElement | null;
  focus: ModuleEvent | null;
  tempFocus: ModuleEvent[];
  overlapToggle: RefObject<HTMLInputElement> | null;
  openOverlapUI: (mod: ModuleEvent, ref: HTMLElement) => void;
  // openPopUpMenu: (mod: ModuleEvent, ref: HTMLElement) => void;
  // closePopUpMenu: () => void;
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
  overlapToggle: null,
  popupMenu: null,
  openOverlapUI: (mod: ModuleEvent, ref: HTMLElement) => {
    get().overlapToggle!.current!.checked = true;
    return set({ anchor: ref, focus: mod });
  },
  // openPopUpMenu: (mod: ModuleEvent, ref: HTMLElement) => {
  //   get().popupMenu!.current!.classList.remove("hidden");
  //   return set({
  //     anchor: ref,
  //     focus: mod,
  //     tempFocus: [{ ...mod }, { ...mod }],
  //   });
  // },
  // closePopUpMenu: () => {
  //   get().popupMenu!.current!.classList.add("hidden");
  //   return set({ anchor: null });
  // },
}));
export const setPopUpMenu = (ref: RefObject<HTMLUListElement>) =>
  calendarHoverStore.setState({ popupMenu: ref });

export const resetHoverProps = () => {
  calendarHoverStore.setState({ ...initialHoverProps });
};

// export const usePopUpMenu = () =>
//   calendarHoverStore((state) => ({
//     open: state.openPopUpMenu,
//     close: state.closePopUpMenu,
//     anchor: state.anchor,
//   }));

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

export const setOverlapToggle = (ref: RefObject<HTMLInputElement>) =>
  calendarHoverStore.setState({ overlapToggle: ref });

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
