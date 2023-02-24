import { DragEvent, PropsWithChildren, ReactNode } from "react";
import { defaultEventElement } from "./fullCalendar/CalendarEvent";
import { defaultSimpleEventElement } from "./SimpleView/CalendarCell";
import { defaultSingleEventElement } from "./SingleData/CalendarRow";
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export interface Style {
  className: string;
  props?: any;
}

export type Interval = {
  start: Date;
  end: Date;
};

export type IntervalWithDuration = Interval & {
  duration: number;
};

export type CalendarItem = { id: any } & IntervalWithDuration;

export type Month = {
  day: Date;
  nbOfDays: number;
};

export type TimeProps = { start: Date; monthLength: number };

export type DayProps = {
  tooltip: { hasTooltip: (day: Date) => boolean; tooltipInfo: any };
  styleProps: (day: Date) => Style;
};

export type CalendarEventComponentProps<T extends CalendarItem> = {
  event?: T;
} & PropsWithChildren &
  React.HTMLAttributes<HTMLElement>;

export type CalendarEventComponent<T extends CalendarItem> = React.FC<
  CalendarEventComponentProps<T>
>;

export type EventProps<
  T extends CalendarItem,
  E extends CalendarEventComponent<T>
> = {
  onClick: (event: T, evt: HTMLElement) => void;
  label: (event: T) => ReactNode;
  style: (event: T) => Style;
  as?: E;
};

export type CalendarData<K, T extends Interval> = {
  key: K;
  labelTitle: string;
  events: T[];
};

export type CommonCalendarProps<
  T extends CalendarItem,
  E extends CalendarEventComponent<T> = typeof defaultEventElement
> = {
  time: TimeProps;
  day: DayProps;
  zoom: number;
  event: EventProps<T, E>; // eventProps
  monthLabelStyle: Style;
};

export type CalendarProps<
  K,
  T extends CalendarItem,
  E extends CalendarEventComponent<T>
> = CommonCalendarProps<T, E> & {
  data: CalendarData<K, T>[];
  LabelComponent: CalendarRowLabel<K>;
  drag: DragEvents<K, T>;
};

export type CalendarRowProps<K, T extends CalendarItem> = {
  events: T[];
  labelProps: {
    key: K;
    title: string;
    LabelComponent: CalendarRowLabel<K>;
  };
};

export type CalendarEvent<T extends CalendarItem> = {
  date: Date;
  event: T;
  span: number;
};

export type DayAndEvent<T extends CalendarItem> = Optional<
  CalendarEvent<T>,
  "event"
>;

export type DragEvents<K, T extends CalendarItem> = {
  drag: (
    dayAndEvent: CalendarEvent<T>,
    key: K,
    evt: DragEvent<HTMLElement>
  ) => void;
  enter: (
    dayAndEvent: DayAndEvent<T>,
    key: K,
    evt: DragEvent<HTMLElement>
  ) => void;
  leave: (
    dayAndEvent: DayAndEvent<T>,
    key: K,
    evt: DragEvent<HTMLElement>
  ) => void;
  drop: (
    dayAndEvent: DayAndEvent<T>,
    key: K,
    evt: DragEvent<HTMLElement>
  ) => void;
  move: (
    dayAndEvent: DayAndEvent<T>,
    key: K,
    evt: DragEvent<HTMLElement>
  ) => void;
};

export type CalendarRowLabel<K> = React.FC<{ labelKey: K }>;

/*
  -----
  SINGLE DATA
  -----
 
*/
export type SingleCalendarEventComponentProps<T extends Interval> = {
  event?: T;
} & PropsWithChildren &
  React.HTMLAttributes<HTMLElement>;

export type SingleCalendarEventComponent<T extends Interval> = React.FC<
  SingleCalendarEventComponentProps<T>
>;
export type SingleEventProps<
  T extends Interval,
  E extends SingleCalendarEventComponent<T>
> = {
  onClick: (event: T, evt: HTMLElement) => void;
  label: (event: T) => String;
  style: (event: T) => Style;
  as?: E;
};

export type CalendarDetailProps<
  T extends Interval,
  E extends SingleCalendarEventComponent<T>
> = {
  style?: Style;
  additionalLabel: string;
  AdditionalInfo: React.FC<{ event: T }>;
  cellHeight: string;
  events: T[];
  eventProps: SingleEventProps<T, E>;
};

export type CalendarDetailRowProps<
  T extends Interval,
  E extends SingleCalendarEventComponent<T> = typeof defaultSingleEventElement
> = {
  event: T;
  AdditionalInfo: React.FC<{ event: T }>;
  eventProps: SingleEventProps<T, E>;
};

/*
-----
SIMPLE VIEW
-----

*/

export type SimpleEventProps<
  T extends CalendarItem,
  E extends CalendarEventComponent<T>
> = {
  onClick: (event: T, evt: HTMLElement) => void;
  label: (event: T) => String;
  style: (date: Date, event?: T) => Style;
  as?: E;
};

export type CalendarSimpleProps<
  T extends CalendarItem,
  E extends CalendarEventComponent<T> = typeof defaultSimpleEventElement
> = {
  time: TimeProps;
  events: T[];
  zoom: number;
  eventProps: SimpleEventProps<T, E>;
  dayProps: DayProps;
  style?: Style;
  monthLabelStyle?: Style;
};
