import { Interval } from "@/components/calendar/types";
import { JoursFeries } from "@/lib/calendar";
import { format } from "@/lib/date";
import { ModuleEvent } from "@/lib/types";
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
  overlapToggle: RefObject<HTMLInputElement> | null;
  openOverlapUI: (mod: ModuleEvent, ref: HTMLElement) => void;
  openPopUpMenu: (mod: ModuleEvent, ref: HTMLElement) => void;
  closePopUpMenu: () => void;
}

const initialHoverProps = {
  anchor: null,
  focus: null,
};

const calendarHoverStore = create<CalendarHoverStore>((set, get) => ({
  ...initialHoverProps,
  overlapToggle: null,
  popupMenu: null,
  openOverlapUI: (mod: ModuleEvent, ref: HTMLElement) => {
    get().overlapToggle!.current!.checked = true;
    return set({ anchor: ref, focus: mod });
  },
  openPopUpMenu: (mod: ModuleEvent, ref: HTMLElement) => {
    get().popupMenu!.current!.classList.remove("hidden");
    return set({ anchor: ref, focus: mod });
  },
  closePopUpMenu: () => {
    get().popupMenu!.current!.classList.add("hidden");
    return set({ anchor: null });
  },
}));
export const setPopUpMenu = (ref: RefObject<HTMLUListElement>) =>
  calendarHoverStore.setState({ popupMenu: ref });

export const resetHoverProps = () => {
  calendarHoverStore.setState({ ...initialHoverProps });
};

export const usePopUpMenu = () =>
  calendarHoverStore((state) => ({
    open: state.openPopUpMenu,
    close: state.closePopUpMenu,
    anchor: state.anchor,
  }));

export const useFocusModule = () => calendarHoverStore((state) => state.focus);

export const setOverlapToggle = (ref: RefObject<HTMLInputElement>) =>
  calendarHoverStore.setState({ overlapToggle: ref });

export const useOverlapModuleUI = () =>
  calendarHoverStore((state) => ({
    // isOpen:
    //   state.overlapToggle &&
    //   state.overlapToggle.current &&
    //   state.overlapToggle.current.checked,
    focus: state.focus,
    anchor: state.anchor,
    // setDraggedModule,
  }));

export const openOverlapUI = calendarHoverStore.getState().openOverlapUI;

/*
  ------ Drag
*/

interface CalendarDragStore {
  draggedModule: ModuleEvent | null;
  dropTarget: Interval | null;
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
  setDropTarget: (dropTarget: Interval) => dragStore.setState({ dropTarget }),
  isDropTarget: (day: Date) =>
    dragStore.getState().dropTarget &&
    isWithinInterval(day, dragStore.getState().dropTarget!),
  cleanDropTarget: () => dragStore.setState({ dropTarget: null }),
});
