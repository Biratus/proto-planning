import { isValid, parseISO } from "date-fns";
import { DragEvent, PropsWithChildren } from "react";
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export interface Style {
  className: string;
  props?: any;
}

export type Interval = {
  start: Date;
  end: Date;
};
export type Serialized<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};
export type SerializedInterval = Serialized<Interval>;

export type IntervalWithDuration = Interval & {
  duration: number;
};

export type CalendarItem = { id: any } & IntervalWithDuration;

export type Month = {
  day: Date;
  nbOfDays: number;
};

export type ComponentForEventProps<T extends Interval> = {
  event: T;
} & PropsWithChildren &
  React.HTMLAttributes<HTMLElement>;

export type ComponentForEvent<T extends Interval> = React.FC<
  ComponentForEventProps<T>
>;

/*
  -----
  FULL DATA
  -----
*/

// Object pour stocker les information d'une ligne du calendrier
export type CalendarData<K, T extends Interval> = {
  key: K; // L'objet de cette ligne
  labelTitle: string; // Libellé de la la ligne
  events: T[]; // Les évenements de cette ligne
};

// Propriété spéciales pour l'affichage des jours
export type DayProps = {
  tooltip: { hasTooltip: (day: Date) => boolean; tooltipInfo: any };
  styleProps: (day: Date) => Style;
};

export type DayComponentProps = {
  date: Date;
} & React.HTMLAttributes<HTMLElement>;

type DayHeaderData = IntervalWithDuration & {
  label: string;
  info: string;
  color: string;
  textColor: string;
};
// Props globale du calendrier
export type CommonCalendarProps<T extends CalendarItem> = {
  timeSpan: Interval; // Interval du calendrier
  day: React.FC<DayComponentProps>; // Prop pour l'affichage des jours
  zoom: number;
  event: ComponentForEvent<T>; // Le component utilisé pour affiché les évenements
  monthLabelStyle: Style;
  daysHeader?: DayHeaderData[]; // Vacances scolaire
};

// Props spécifique à un calendrier
export type CalendarProps<
  K,
  T extends CalendarItem
> = CommonCalendarProps<T> & {
  data: CalendarData<K, T>[];
  LabelComponent: CalendarRowLabel<K>;
  drag: DragEvents<K, T>;
  dayStyle: (day: Date, row?: K) => Style; // Style des jours sans évenements
};

// Props spécifique à une ligne
export type CalendarRowProps<K, T extends CalendarItem> = {
  events: T[];
  labelProps: {
    // Props de la première colonne de la ligne
    key: K; // Objet auquel on fait référence
    title: string; // Libellé
    LabelComponent: CalendarRowLabel<K>; // Component d'affichage
  };
};

// Props spécifique à un évenement
export type CalendarEvent<T extends CalendarItem> = {
  date: Date;
  event: T;
  span: number;
};

// Donnée d'un jour ou évenement
export type CalendarDay<T extends CalendarItem> = Optional<
  CalendarEvent<T>,
  "event"
>;

//DragFunctions
type DragFunction<K, T extends CalendarItem> = (
  day: CalendarDay<T>, // Jour qui est target
  key: K, // Objet de la ligne
  evt: DragEvent<HTMLElement>
) => void;

type DragEventFunction<K, T extends CalendarItem> = (
  dayAndEvent: CalendarEvent<T>, //Evenement qui est drag
  key: K, // Objet de la ligne
  evt: DragEvent<HTMLElement>
) => void;

export type DragEvents<K, T extends CalendarItem> = {
  drag: DragEventFunction<K, T>;
  enter: DragFunction<K, T>;
  leave: DragFunction<K, T>;
  drop: DragFunction<K, T>;
  move: DragFunction<K, T>;
};

export type CalendarRowLabel<K> = React.FC<{ labelKey: K }>;

/*
  -----
  SINGLE DATA
  -----
*/
export type CalendarDetailProps<T extends Interval> = {
  style?: Style;
  additionalLabel: string;
  AdditionalInfo: React.FC<{ event: T }>;
  cellHeight: string;
  events: T[];
  dayComponent: ComponentForEvent<T>;
  eventComponent: ComponentForEvent<T>;
};

export type CalendarDetailRowProps<T extends Interval> = {
  event: T;
  AdditionalInfo: React.FC<{ event: T }>;
  eventComponent: ComponentForEvent<T>;
  dayComponent: ComponentForEvent<T>;
};

/*
-----
SIMPLE VIEW
-----

*/

export type SimpleEventProps<T extends CalendarItem> = {
  onClick: (event: T, evt: HTMLElement) => void;
  label: (event: T) => String;
  style: (date: Date, event?: T) => Style;
};

export type CalendarSimpleProps<T extends CalendarItem> = {
  timeSpan: Interval;
  events: T[];
  zoom: number;
  eventProps: SimpleEventProps<T>;
  dayProps: DayProps;
  style?: Style;
  monthLabelStyle?: Style;
};

export function deserialize<T>(serialized: Serialized<T>): T {
  const result = Object.create(Object.getPrototypeOf(serialized)) as T;
  for (const key in serialized) {
    if (serialized.hasOwnProperty(key)) {
      const value = serialized[key];
      if (typeof value === "string" && isValid(parseISO(value))) {
        result[key as keyof T] = parseISO(value) as any;
      } else {
        result[key as keyof T] = value as any;
      }
    }
  }
  return result;
}
