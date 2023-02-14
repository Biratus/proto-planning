"use client";

import { Module } from "@/lib/types";
import { useCallback } from "react";
import {
  resetHoverProps,
  useFocusModule,
} from "../(calendar)/CalendarProvider";
import SplitModuleModal from "./(modals)/SplitModuleModal";
import SwitchFormateurModal from "./(modals)/SwitchFormateurModal";
import OverlapModuleOverlay from "./OverlapModuleOverlay";

export default function HoverElements() {
  const {
    focus: focusModule,
    temps: tempModules,
    setTempModule,
    setTempModules,
  } = useFocusModule();

  const submitSwitchForm = useCallback(
    async (module?: Module) => {
      console.log("submitSwitchForm");
      console.log({ old: focusModule, new: tempModules[0] });
      // if(success)
      resetHoverProps();
      return true;
    },
    [tempModules, focusModule]
  );
  const submitSplitForm = useCallback(async () => {
    console.log(tempModules);
    // async ({ split, formateurs }: { split: Date; formateurs: Formateur[] }) => {
    // console.log("submitSplitForm");
    // console.log({ split, formateurs, focusModule });
    // if(success)
    resetHoverProps();
    return true;
  }, [tempModules]);
  return (
    <>
      <SwitchFormateurModal
        onClose={resetHoverProps}
        module={tempModules[0]}
        setModule={setTempModule}
        submit={submitSwitchForm}
      />
      <SplitModuleModal
        onClose={resetHoverProps}
        modules={tempModules}
        setModules={setTempModules}
        submit={submitSplitForm}
      />
      <OverlapModuleOverlay />
    </>
  );
}
