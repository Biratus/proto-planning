"use client";
import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { create, StoreApi, UseBoundStore, useStore } from "zustand";
import {
  CalendarEventComponent,
  CalendarItem,
  DayProps,
  SimpleEventProps,
} from "../types";

type SimpleCalendarProps<
  T extends CalendarItem,
  E extends CalendarEventComponent<T>
> = {
  cellHeight: string;
  event: SimpleEventProps<T, E>;
  day: DayProps;
};

type SimpleCalendarStore<
  T extends CalendarItem,
  E extends CalendarEventComponent<T>
> = UseBoundStore<StoreApi<SimpleCalendarProps<T, E>>>;

const CalendarContext = createContext<SimpleCalendarStore<
  any,
  CalendarEventComponent<any>
> | null>(null);

type CreateSimpleCalendarStoreFunction = <
  T extends CalendarItem,
  E extends CalendarEventComponent<T>
>(
  cellHeight: string,
  event: SimpleEventProps<T, E>,
  day: DayProps
) => SimpleCalendarStore<T, E>;

const calendarStore: CreateSimpleCalendarStoreFunction = <
  T extends CalendarItem,
  E extends CalendarEventComponent<T>
>(
  cellHeight: string,
  event: SimpleEventProps<T, E>,
  day: DayProps
) =>
  create<SimpleCalendarProps<T, E>>((set) => ({
    cellHeight,
    event,
    day,
  }));

export default function SimpleCalendarProvider<
  T extends CalendarItem,
  E extends CalendarEventComponent<T>
>({
  cellHeight,
  event,
  day,
  children,
}: PropsWithChildren & SimpleCalendarProps<T, E>) {
  const storeRef = useRef<SimpleCalendarStore<T, E>>();
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
