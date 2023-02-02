import { ReactNode } from "react";
import { Style } from "./styles";

export type Duration = {
  duration: number;
};

export type Interval = {
  start: Date;
  end: Date;
};

export type IntervalWithDuration = Interval & Duration;

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

export type CalendarProps<K, T extends Interval> = {
  data: CalendarData<K, T>[];
  LabelComponent: React.FC<{ labelKey: K }>;
  EventTooltip?: React.FC;
  time: { start: Date; monthLength: number };
  event: EventProps<T>; // eventProps
  day: DayProps;
  commonDayStyle: (date: Date) => Style;
  zoom: number;
  drag?: any;
};

export type CalendarRowProps<K, T extends IntervalWithDuration> = {
  events: T[];
  labelProps: {
    key: K;
    title: string;
    LabelComponent: React.FC<{ labelKey: K }>;
  };
  EventTooltip?: React.FC;
};

export type CalendarEvent<T> = {
  date: Date;
  event: T;
  span: number;
};

export type FullCalendarContext<T> = {
  days?: Date[];
  eventProps?: EventProps<T>;
  commonDayStyle?: (date: Date) => Style;
  drag?: any;
};
