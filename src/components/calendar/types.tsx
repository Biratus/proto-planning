import { DragEvent, ReactNode } from "react";
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
  onClick: (event: T, evt: HTMLElement) => void;
  label: (event: T) => ReactNode;
  style: (event: T) => Style;
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

export type CalendarRowProps<K, T extends CalendarItem> = {
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

export type CalendarDetailContext<T> = EventProps<T>;

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

export type SimpleEventProps<T> = {
  onClick: (event: T, evt: HTMLElement) => void;
  label: (event: T) => ReactNode;
  style: (date: Date, event?: T) => Style;
};

export type CalendarSimpleProps<T extends CalendarItem> = {
  time: { start: Date; monthLength: number };
  events: T[];
  zoom: number;
  eventProps: SimpleEventProps<T>;
  dayProps: DayProps;
  style?: Style;
};

export type DayAndEvent<T extends CalendarItem> = {
  date: Date;
  event?: T;
};
