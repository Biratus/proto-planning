"use client";
import { useLegendStore } from "@/components/legend/Legend";
import { isFormateurMissing } from "@/lib/realData";
import { mergeStyle } from "@/lib/style";
import { ModuleEvent } from "@/lib/types";
import { ComponentForEventProps } from "@/packages/calendar/types";
import cn from "classnames";
import { useCallback, useMemo } from "react";
import { AlertTriangle } from "react-feather";
import { ModuleDetailModalId } from "../(hover)/(modals)/ModuleModal";
import { overlayID } from "../(hover)/OverlapModuleOverlay";
import { eventLabelDisplay } from "../../(store)/displayStore";
import { openOverlapUI, setFocusModule } from "../../(store)/hoverStore";
import {
  eventStyle,
  missingFormateurStyle,
  overlapModuleStyle,
} from "./CalendarStyle";

export default function EventComponent({
  event: mod,
  children,
  ...props
}: ComponentForEventProps<ModuleEvent>) {
  const colorOf = useLegendStore((state) => state.colorOf);
  const eventLabel = eventLabelDisplay();

  const eventOnClick = useCallback(
    (evt: HTMLElement) => {
      if (mod.overlap) {
        openOverlapUI(mod, evt);
      } else {
        setFocusModule(mod);
      }
    },
    [mod]
  );

  const wholeStyle = useMemo(() => {
    let style = eventStyle(colorOf(mod.theme));
    if (mod.overlap) {
      style = mergeStyle(style, overlapModuleStyle);
    } else if (isFormateurMissing(mod)) {
      style = mergeStyle(style, missingFormateurStyle(colorOf(mod.theme)));
    }
    return style;
  }, [mod]);

  return (
    <label
      {...props}
      htmlFor={mod!.overlap ? overlayID : ModuleDetailModalId}
      className={`pl-1 ${props.className} ${wholeStyle.className}`}
      onClick={(evt) => eventOnClick(evt.currentTarget)}
      style={{
        ...props.style,
        ...wholeStyle.props,
      }}
    >
      {mod!.overlap ? (
        <AlertTriangle
          color="red"
          className={cn({ "ml-2": mod!.duration != 1 })}
        />
      ) : (
        <span className="truncate">{eventLabel(mod)}</span>
      )}
    </label>
  );
}
