"use client";
import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { create, StoreApi, UseBoundStore, useStore } from "zustand";
import {
  CalendarItem,
  ComponentForEvent,
  DayProps,
  SimpleEventProps,
} from "../types";

type SimpleCalendarProps<T extends CalendarItem> = {
  cellHeight: string;
  event: SimpleEventProps<T>;
  day: DayProps;
};

type SimpleCalendarStore<T extends CalendarItem> = UseBoundStore<
  StoreApi<SimpleCalendarProps<T>>
>;

const CalendarContext = createContext<SimpleCalendarStore<any> | null>(null);

type CreateSimpleCalendarStoreFunction = <T extends CalendarItem>(
  cellHeight: string,
  event: SimpleEventProps<T>,
  day: DayProps
) => SimpleCalendarStore<T>;

const calendarStore: CreateSimpleCalendarStoreFunction = <
  T extends CalendarItem
>(
  cellHeight: string,
  event: SimpleEventProps<T>,
  day: DayProps
) =>
  create<SimpleCalendarProps<T>>((set) => ({
    cellHeight,
    event,
    day,
  }));

export default function SimpleCalendarProvider<
  T extends CalendarItem,
  E extends ComponentForEvent<T>
>({
  cellHeight,
  event,
  day,
  children,
}: PropsWithChildren & SimpleCalendarProps<T>) {
  const storeRef = useRef<SimpleCalendarStore<T>>();
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
