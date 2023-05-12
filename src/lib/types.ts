import {
  CalendarRowLabel,
  IntervalWithDuration,
} from "@/packages/calendar/types";

export interface Filiere {
  nom: string;
  modules?: Module[];
}

export interface SerializedFiliere {
  nom: string;
  modules?: SerializedModule[];
}

export interface Formateur {
  mail: string;
  nom: string;
  prenom: string;
  modules?: Module[];
}

export type FormateurWithModule = Formateur & {
  modules: Module[];
};
export type Serialized<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

export type Module = {
  id: number;
  nom: string;
  theme: string;
  filiere: Filiere;
  formateur?: Formateur | null;
  start: Date;
  end: Date;
};
export type SerializedModule = Serialized<Module>;

export type ModuleEvent = Module &
  IntervalWithDuration & {
    overlap?: boolean;
    overlappedModules?: ModuleEvent[];
  };

export type CalendarView<K> = {
  key: string;
  label: string;
  keyObject: (obj: any) => K;
  labelTitle: (key: K) => string;
  LabelComponent: CalendarRowLabel<K>;
};

export interface ModuleHistory extends Module {
  module_id: number;
  modified_by: number | null;
  modified_datetime: Date;
}
