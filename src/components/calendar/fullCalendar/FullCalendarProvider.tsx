"use client";
import { Interval } from "date-fns";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { create, useStore } from "zustand";
import { Style } from "../styles";
import { EventProps } from "../types";

type FullCalendarProps<T extends Interval> = {
  days?: Date[];
  eventProps?: EventProps<T>;
  commonDayStyle?: (date: Date) => Style;
  drag?: any;
};
type FullCalendarStore = ReturnType<typeof calendarStore>;
const CalendarContext = createContext<FullCalendarStore | null>(null);

const calendarStore = (
  days?: Date[],
  eventProps?: EventProps<any & Interval>,
  commonDayStyle?: (date: Date) => Style,
  drag?: any
) =>
  create<FullCalendarProps<Interval>>((set) => ({
    days,
    eventProps,
    commonDayStyle,
    drag,
  }));

export default function FullCalendarProvider<T extends Interval>({
  days,
  eventProps,
  commonDayStyle,
  drag,
  children,
}: PropsWithChildren & FullCalendarProps<T>) {
  const store = useMemo<FullCalendarStore>(
    () => calendarStore(days, eventProps, commonDayStyle, drag),
    [days, eventProps, commonDayStyle, drag]
  );

  return (
    <CalendarContext.Provider value={store}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useFullCalendarRow() {
  const store = useContext(CalendarContext);
  if (!store)
    throw new Error(
      "useFullCalendarRow must be used within a FullCalendarProvider"
    );

  return useStore(store, (state) => ({
    days: state.days,
    commonDayStyle: state.commonDayStyle,
    drag: state.drag,
  }));
}

export function useFullCalendarEvent() {
  const store = useContext(CalendarContext);
  if (!store)
    throw new Error(
      "useFullCalendarEvent must be used within a FullCalendarProvider"
    );

  return useStore(store, (state) => ({
    eventProps: state.eventProps,
    commonDayStyle: state.commonDayStyle,
  }));
}
