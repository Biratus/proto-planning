"use client";
import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { create, useStore } from "zustand";
import { CalendarItem, DayProps, SimpleEventProps } from "../types";

type SimpleCalendarProps<T extends CalendarItem> = {
  cellHeight: string;
  event: SimpleEventProps<T>;
  day: DayProps;
};

type SimpleCalendarStore = ReturnType<typeof calendarStore>;

const CalendarContext = createContext<SimpleCalendarStore | null>(null);
const calendarStore = (
  cellHeight: string,
  event: SimpleEventProps<any & CalendarItem>,
  day: DayProps
) =>
  create<SimpleCalendarProps<CalendarItem>>((set) => ({
    cellHeight,
    event,
    day,
  }));

export default function SimpleCalendarProvider<T extends CalendarItem>({
  cellHeight,
  event,
  day,
  children,
}: PropsWithChildren & SimpleCalendarProps<T>) {
  const storeRef = useRef<SimpleCalendarStore>();
  if (!storeRef.current) {
    storeRef.current = calendarStore(cellHeight, event, day);
  }

  return (
    <CalendarContext.Provider value={storeRef.current}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useSimpleCalendar() {
  let store = useContext(CalendarContext);
  if (!store)
    throw new Error(
      "useSimpleCalendar must be used within a SimpleCalendarProvider"
    );
  return useStore(store);
}
