/*
  ------ Drag
*/

import { ModuleEvent } from "@/lib/types";
import { Interval } from "@/packages/calendar/types";
import { isWithinInterval } from "date-fns";
import { create } from "zustand";

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
