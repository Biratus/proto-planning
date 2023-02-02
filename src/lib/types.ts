import { IntervalWithDuration } from "@/components/calendar/types";

export interface Formateur {
  id?: string;
  mail: string;
  nom: string;
  prenom: string;
}

export interface RawModule {
  id: string;
  name: string;
  start: string;
  end: string;
  theme: string;
  filiere: string;
  formateur: Formateur;
}
export interface Module extends IntervalWithDuration {
  id: string;
  name: string;
  theme: string;
  filiere: string;
  formateur: Formateur;
  overlap?: boolean;
  overlappedModules?: Module[];
}

export type CalendarEvent = Interval & {
  duration: number;
};

export type ModuleEvent = Module & CalendarEvent;
