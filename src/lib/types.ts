import { ReactElement } from "react";
export interface CalendarView<T> {
  key: string;
  label: string;
  keyObject: (key: ModuleEvent) => T;
  labelTitle: (key: T) => string;
  LabelComponent: (key: T) => ReactElement;
}

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
export type Interval = {
  start: Date;
  end: Date;
};
export interface Module extends Interval {
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

export type CalendarData<T> = {
  key: T;
  labelTitle: string;
  events: ModuleEvent[];
};
