import { CalendarEvent, TimeProps } from "@/components/calendar/types";
import { addDays, isBefore } from "date-fns";
import { ModuleEvent } from "./types";

type CustomMouseCoord = {
  targetWidth: number;
  mouseOffsetX: number;
};

export function getTargetDay(
  targetModule: CalendarEvent<ModuleEvent>,
  { targetWidth, mouseOffsetX }: CustomMouseCoord,
  timeProps: TimeProps
) {
  let targetDuration = targetModule.span!;
  const dayOffset = Math.floor(mouseOffsetX / (targetWidth / targetDuration));
  let fromDate = isBefore(targetModule.event!.start, timeProps.start)
    ? timeProps.start
    : targetModule.event!.start;
  return addDays(fromDate, dayOffset);
}
