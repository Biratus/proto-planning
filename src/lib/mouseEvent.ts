import { addDays } from "date-fns";
import { ModuleEvent } from "./types";

type CustomMouseCoord = {
    targetWidth:number, mouseOffsetX:number
}

export function getTargetDay(targetModule:ModuleEvent, { targetWidth, mouseOffsetX }:CustomMouseCoord) {
  let targetDuration = targetModule.duration;
  const dayOffset = Math.floor(mouseOffsetX / (targetWidth / targetDuration));
  return addDays(targetModule.start, dayOffset);
}
