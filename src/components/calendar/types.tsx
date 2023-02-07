import { DragEvent, MouseEvent, ReactNode } from "react";
import { Style } from "./styles";

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

export type DayProps = {
  tooltip: { hasTooltip: (day: Date) => boolean; tooltipInfo: any };
  styleProps: (day: Date) => Style;
};
export type EventProps<T> = {
  highlighted: (event: T) => boolean;
  highlightedProps: (event: T) => Style;
  onClick: (event: T, evt: HTMLElement) => void;
  color: (event: T) => string;
  label: (event: T) => ReactNode;
};

export type CalendarData<K, T extends Interval> = {
  key: K;
  labelTitle: string;
  events: T[];
};

export type CommonCalendarProps<T> = {
  EventTooltip?: React.FC;
  time: { start: Date; monthLength: number };
  day: DayProps;
  commonDayStyle: (date: Date) => Style;
  zoom: number;
  event: EventProps<T>; // eventProps
};

export type CalendarProps<
  K,
  T extends CalendarItem
> = CommonCalendarProps<T> & {
  data: CalendarData<K, T>[];
  LabelComponent: CalendarRowLabel<K>;
  drag: DragEvents<K, T>;
};

export type CalendarRowProps<K, T extends IntervalWithDuration> = {
  events: T[];
  labelProps: {
    key: K;
    title: string;
    LabelComponent: CalendarRowLabel<K>;
  };
  EventTooltip?: React.FC;
};

export type CalendarEvent<T> = {
  date: Date;
  event: T;
  span: number;
};

export type DragEvents<K, T extends CalendarItem> = {
  drag: (
    dayAndEvent: DayAndEvent<T>,
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

export type CalendarDetailContext<T> = {
  color: (mod: T) => string;
  eventHighlighted: (mod: T) => boolean;
  highlightedProps: (color: string) => Style;
  onClick: (mod: T, event: MouseEvent) => void;
  label: (mod: T) => string;
};

export type CalendarDetailProps<T extends Interval> = {
  style?: Style;
  additionalLabel: string;
  AdditionalInfo: React.FC<{ event: T }>;
  cellHeight: string;
  events: T[];
  context: React.Context<CalendarDetailContext<T>>;
};

export type CalendarDetailRowProps<T extends Interval> = {
  event: T;
  context: React.Context<CalendarDetailContext<T>>;
  AdditionalInfo: React.FC<{ event: T }>;
};

/*
-----
SIMPLE VIEW
-----

*/

export type CalendarSimpleProps<T extends CalendarItem> = {
  time: { start: Date; monthLength: number };
  events: T[];
  zoom: number;
  eventProps: EventProps<T>;
  dayProps: DayProps;
  style?: Style;
};

export type DayAndEvent<T extends CalendarItem> = {
  date: Date;
  event?: T;
};
