/*
  ------ Data
*/

import { ModuleEvent } from "@/lib/types";
import { create } from "zustand";
import {
  FiliereView,
  FormateurView,
} from "../(components)/(calendar)/CalendarView";

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

const calendarDisplayStore = create<DisplayViewStore>((set, get) => ({
  eventLabel: displayViews[0].print,
  selectedDisplay: displayViews[0].label,
}));

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
