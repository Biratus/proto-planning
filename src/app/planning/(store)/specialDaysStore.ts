/*
  ------ SpecialDays
*/

import { JoursFeries } from "@/lib/calendar/joursFeries";
import { format } from "@/lib/date";
import { create } from "zustand";

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
