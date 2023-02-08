"use client";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { create, StoreApi, UseBoundStore, useStore } from "zustand";
import { Style } from "../styles";
import { CalendarItem, DragEvents, EventProps } from "../types";

type FullCalendarProps<K, T extends CalendarItem> = {
  days: Date[];
  eventProps: EventProps<T>;
  dayStyle: (date: Date) => Style;
  drag: DragEvents<K, T>;
};

const CalendarContext = createContext<FullCalendarStore<any, any> | null>(null);

type FullCalendarStore<K, T extends CalendarItem> = UseBoundStore<
  StoreApi<FullCalendarProps<K, T>>
>;

type CreateFullCalendarStoreFuction = <K, T extends CalendarItem>(
  days: Date[],
  eventProps: EventProps<any & T>,
  dayStyle: (date: Date) => Style,
  drag: DragEvents<K, T>
) => FullCalendarStore<K, T>;

const calendarStore: CreateFullCalendarStoreFuction = <
  K,
  T extends CalendarItem
>(
  days: Date[],
  eventProps: EventProps<any & T>,
  dayStyle: (date: Date) => Style,
  drag: DragEvents<K, T>
) =>
  create<FullCalendarProps<K, T>>((set) => ({
    days,
    eventProps,
    dayStyle,
    drag,
  }));

export default function FullCalendarProvider<K, T extends CalendarItem>({
  days,
  eventProps,
  dayStyle,
  drag,
  children,
}: PropsWithChildren & FullCalendarProps<K, T>) {
  const store = useMemo(
    () => calendarStore<K, T>(days, eventProps, dayStyle, drag),
    [days, eventProps, dayStyle, drag]
  );

  return (
    <CalendarContext.Provider value={store}>
      {children}
    </CalendarContext.Provider>
  );
}

type CalendarRowStore<K, T extends CalendarItem> = {
  days: Date[];
  dayStyle: (date: Date) => Style;
  drag: DragEvents<K, T>;
};

export function useFullCalendarRow<
  K,
  T extends CalendarItem
>(): CalendarRowStore<K, T> {
  const store = useContext(CalendarContext) as FullCalendarStore<K, T>;
  if (!store)
    throw new Error(
      "useFullCalendarRow must be used within a FullCalendarProvider"
    );

  return useStore(store, (state) => ({
    days: state.days,
    dayStyle: state.dayStyle,
    drag: state.drag,
  }));
}

type CalendarEventStore<T extends CalendarItem> = EventProps<T>;

export function useFullCalendarEvent<
  T extends CalendarItem
>(): CalendarEventStore<T> {
  const store = useContext(CalendarContext) as FullCalendarStore<any, T>;
  if (!store)
    throw new Error(
      "useFullCalendarEvent must be used within a FullCalendarProvider"
    );

  return useStore(store, (state) => state.eventProps);
}
