"use client";
import { useLegendStore } from "@/components/legend/Legend";
import { Module, ModuleEvent } from "@/lib/types";
import { eachDayOfInterval } from "date-fns";
import { DragEvent, useCallback, useMemo, useRef } from "react";
import {
  setDraggedModule,
  setOverlapToggle,
  useOverlapModuleUI,
} from "../(calendar)/CalendarProvider";

export const overlayID = "overlapModuleOverlayId";
export default function OverlapModuleOverlay() {
  const colorOf = useLegendStore((state) => state.colorOf);
  const toggleRef = useRef<HTMLInputElement>(null);
  const initilized = useRef(false);
  if (!initilized.current) {
    setOverlapToggle(toggleRef);
    initilized.current = true;
  }
  const { focus, anchor } = useOverlapModuleUI();

  const position = useMemo(
    () => anchor && anchor.getBoundingClientRect(),
    [anchor]
  );
  const cellWidth = anchor && focus && anchor.clientWidth / focus.duration;
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

  const dragStart = (evt: DragEvent<HTMLElement>) => {
    console.log("dragStart");
    setDraggedModule(focus!);
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
      <label htmlFor={overlayID} className="modal text-white items-start">
        <h3 className="text-bold text-center mt-5 text-2xl">
          Déplacer le module souhaité
        </h3>
        {toggleRef.current && toggleRef.current.checked && focus && (
          <div
            className="flex flex-col gap-2 absolute"
            style={{
              top: `${position!.top}px`,
              left: `${position!.left}px`,
              transform: `translateY(${anchor!.clientHeight}px)`,
            }}
          >
            {focus.overlappedModules!.map((mod: ModuleEvent, i: number) => (
              <div
                key={i}
                className="cursor-grab flex items-center px-2 hover:opacity-80 font-bold"
                style={{
                  height: `${anchor!.clientHeight}px`,
                  width: `${(mod.duration * cellWidth!).toFixed(2)}px`,
                  backgroundColor: colorOf(mod.theme),
                  marginLeft: `${dayOffset(mod) * cellWidth!}px`,
                }}
                draggable
                onDragStart={dragStart}
                //   onDragEnd={onClose}
              >
                <span className="truncate">{mod.name}</span>
              </div>
            ))}
          </div>
        )}
      </label>
    </>

    //     {data.overlappedModules.map((mod, i) => (
    //       <FormateurTooltip event={mod} key={i}>
    //         <Box
    //           draggable
    //           onDragStart={(evt) => dragStart(mod, evt)}
    //           onDragEnd={onClose}
    //           sx={{
    //             height: `${anchor.clientHeight}px`,
    //             width: `${(mod.duration * cellWidth).toFixed(2)}px`,
    //             backgroundColor: colorOf(mod.theme),
    //             marginLeft: `${dayOffset(mod) * cellWidth}px`,
    //             cursor: "grab",
    //             display: "flex",
    //             alignItems: "center",
    //             px: 1,
    //             "&:hover": {
    //               opacity: 0.8,
    //             },
    //           }}
    //         >
    //           <Typography noWrap fontWeight="bold">
    //             {mod.name}
    //           </Typography>
    //         </Box>
    //       </FormateurTooltip>
    //     ))}
    //   </Stack>
    // </Backdrop>
  );
}
