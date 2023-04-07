import {
  CalendarRowLabel,
  IntervalWithDuration,
} from "@/packages/calendar/types";

export interface Filiere {
  nom: string;
  modules: Module[];
}

export interface SerializedFiliere {
  nom: string;
  modules: SerializedModule[];
}

export interface Formateur {
  mail: string;
  nom: string;
  prenom: string;
  modules?: Module[];
}

export type FormateurWithModule = Formateur & { modules: Module[] };
export type FormateurWithSerializedModule = Formateur & {
  modules: SerializedModule[];
};

export interface SerializedModule {
  id: number;
  nom: string;
  start: string | Date;
  end: string | Date;
  theme: string;
  filiere: { nom: string };
  formateur: Formateur;
}
export interface Module extends SerializedModule {
  start: Date;
  end: Date;
}

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
