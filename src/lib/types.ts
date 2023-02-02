import {
  CalendarRowLabel,
  IntervalWithDuration,
} from "@/components/calendar/types";

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
export interface Module {
  id: string;
  name: string;
  start: Date;
  end: Date;
  theme: string;
  filiere: string;
  formateur: Formateur;
  overlap?: boolean;
  overlappedModules?: Module[];
}

export type ModuleEvent = Module & IntervalWithDuration;

export type CalendarView<K> = {
  key: string;
  label: string;
  keyObject: (obj: any) => K;
  labelTitle: (key: K) => string;
  LabelComponent: CalendarRowLabel<K>;
};
