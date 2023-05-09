import { eachDayOfInterval } from "date-fns";
import {
  CalendarDetailRowProps,
  ComponentForEventProps,
  Interval,
} from "../types";
export const defaultSingleEventElement = ({
  children,
  ...props
}: ComponentForEventProps<Interval>) => <div {...props}>{children}</div>;

export default function CalendarRow<T extends Interval>({
  event,
  AdditionalInfo,
  eventComponent: EventComponent,
  dayComponent: DayComponent,
}: CalendarDetailRowProps<T>) {
  const { start, end } = event;

  let dayNb = eachDayOfInterval({ start, end }).length;

  return (
    <>
      <DayComponent
        event={event}
        className="border-b border-gray-500 pl-3 dark:border-white"
        style={{ gridRowEnd: "span " + dayNb }}
      />
      <EventComponent
        event={event}
        className="border-b border-gray-500 pl-3 dark:border-white"
        style={{
          gridRowEnd: "span " + dayNb,
        }}
      />
      <div
        className="border-b border-gray-500 pl-3 dark:border-white"
        style={{ gridRowEnd: "span " + dayNb }}
      >
        <AdditionalInfo event={event} />
      </div>
    </>
  );
}
