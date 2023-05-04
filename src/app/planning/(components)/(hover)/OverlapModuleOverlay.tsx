"use client";
import { useLegendStore } from "@/components/legend/Legend";
import { Module, ModuleEvent } from "@/lib/types";
import { eachDayOfInterval } from "date-fns";
import { useCallback, useMemo, useRef } from "react";
import {
  setDraggedModule,
  setFocusModule,
  useOverlapModuleUI,
} from "../(calendar)/CalendarProvider";
import { ModuleDetailModalId } from "./(modals)/ModuleModal";

export const overlayID = "overlapModuleOverlayId";
export default function OverlapModuleOverlay() {
  const colorOf = useLegendStore((state) => state.colorOf);
  const toggleRef = useRef<HTMLInputElement>(null);

  const { focus, anchor } = useOverlapModuleUI();

  const position = useMemo(
    () =>
      anchor ? anchor.getBoundingClientRect() : { top: 0, left: 0, height: 0 },
    [anchor]
  );
  const cellWidth = anchor && focus ? anchor.clientWidth / focus.duration : 0;

  const dayOffset = useCallback(
    (mod: Module) => {
      return (
        eachDayOfInterval({
          start: focus!.start,
          end: mod.start,
        }).length - 1
      );
    },
    [focus]
  );

  const dragStart = (mod: ModuleEvent) => {
    setDraggedModule(mod);
    toggleRef.current!.checked = false;
  };

  return (
    <>
      <input
        type="checkbox"
        id={overlayID}
        ref={toggleRef}
        className="modal-toggle"
      />
      <label htmlFor={overlayID} className="modal items-start text-white">
        <h3 className="text-bold mt-5 text-center text-2xl">
          Déplacer le module souhaité
        </h3>
        {focus && focus.overlappedModules && (
          <div
            className="absolute flex flex-col gap-2"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform: `translateY(${position.height}px)`,
            }}
          >
            {focus.overlappedModules.map((mod: ModuleEvent, i: number) => (
              <label
                htmlFor={ModuleDetailModalId}
                key={i}
                className="flex cursor-grab items-center px-2 font-bold hover:opacity-80"
                style={{
                  height: `${position.height}px`,
                  width: `${(mod.duration * cellWidth).toFixed(2)}px`,
                  backgroundColor: colorOf(mod.theme),
                  marginLeft: `${dayOffset(mod) * cellWidth}px`,
                }}
                draggable
                onDragStart={() => dragStart(mod)}
                onClick={() => setFocusModule(mod)}
              >
                <span className="truncate">{mod.nom}</span>
              </label>
            ))}
          </div>
        )}
      </label>
    </>
  );
}
