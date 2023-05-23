import { JoursFeries } from "@/lib/calendar/joursFeries";
import { format } from "@/lib/date";
import { Filiere, ModuleEvent } from "@/lib/types";
import { Interval } from "@/packages/calendar/types";
import { isWithinInterval } from "date-fns";
import { create } from "zustand";
import { FiliereView, FormateurView } from "./CalendarView";

/*
  ------ Data
*/

type DisplayView = {
  label: string;
  print: (mod: ModuleEvent) => string;
  for?: string;
};

export const displayViews: DisplayView[] = [
  {
    label: "Module",
    print: (mod: ModuleEvent) => mod.nom,
  },
  {
    label: "Filière",
    print: (mod: ModuleEvent) => mod.filiere!.nom,
    for: FormateurView.key,
  },
  {
    label: "Formateur",
    print: (mod: ModuleEvent) =>
      mod.formateur!.nom + " " + mod.formateur!.prenom,
    for: FiliereView.key,
  },
];
type DisplayViewStore = {
  eventLabel: (mod: ModuleEvent) => string;
  selectedDisplay: string;
};

type CalendarDisplayStore = DisplayViewStore & {
  selectedView: string;
};

const calendarDisplayStore = create<CalendarDisplayStore>((set, get) => ({
  eventLabel: displayViews[0].print,
  selectedDisplay: displayViews[0].label,
  selectedView: FiliereView.key,
}));

export const setSelectedView = (view: string) => {
  calendarDisplayStore.setState({ selectedView: view });
};

export const getSelectedView = () =>
  calendarDisplayStore(({ selectedView }) => selectedView);

export const useModuleEventDisplay = () =>
  calendarDisplayStore((state) => ({
    get: state.selectedDisplay,
    set: (label: string) => {
      calendarDisplayStore.setState({
        selectedDisplay: label,
        eventLabel: displayViews.find((v) => v.label == label)!.print,
      });
    },
  }));

export const eventLabelDisplay = () =>
  calendarDisplayStore(({ eventLabel }) => eventLabel);

/*
  ------ SpecialDays
*/

type SpecialDaysProps = {
  joursFeries: JoursFeries;
};
type CalendarStore = SpecialDaysProps & {
  isJoursFeries: (date: Date) => boolean;
  getJourFerie: (date: Date) => string;
};
const specialDaysStore = create<CalendarStore>((set, get) => ({
  joursFeries: {},
  vacances: [],
  vacanceData: [],
  isJoursFeries: (day: Date) =>
    get().joursFeries.hasOwnProperty(format(day, "yyyy-MM-dd")),
  getJourFerie: (day: Date) => get().joursFeries[format(day, "yyyy-MM-dd")],
}));

export const setSpecialDays = ({ joursFeries }: SpecialDaysProps) =>
  specialDaysStore.setState({
    joursFeries,
  });

export const useJoursFeries = () =>
  specialDaysStore((state) => ({
    isJoursFeries: state.isJoursFeries,
    getJourFerie: state.getJourFerie,
  }));

export const useSpecialDays = () =>
  specialDaysStore((s) => ({
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

type DropTarget<T> = { row: T; interval: Interval };

interface CalendarDragStore {
  draggedModule: ModuleEvent | null;
  dropTarget: DropTarget<any> | null;
}

const dragStore = create<CalendarDragStore>((set, get) => ({
  draggedModule: null,
  dropTarget: null,
}));

export const setDraggedModule = (mod: ModuleEvent) =>
  dragStore.setState({ draggedModule: mod });

export const useDropTarget = <T>() => ({
  draggedModule: dragStore((s) => s.draggedModule),
  dropTarget: dragStore((s) => s.dropTarget as DropTarget<T>),
  setDropTarget: (interval: Interval, row?: T) =>
    dragStore.setState({ dropTarget: { interval, row } }),
  isDropTarget: (day: Date) =>
    dragStore.getState().dropTarget &&
    isWithinInterval(day, dragStore.getState().dropTarget!.interval),
  cleanDropTarget: () => {
    dragStore.setState({ dropTarget: null });
  },
});
