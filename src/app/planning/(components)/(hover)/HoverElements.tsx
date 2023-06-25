"use client";

import { ModuleEvent } from "@/lib/types";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import { resetHoverProps, useFocusModule } from "../../(store)/hoverStore";
const SplitModuleModal = dynamic(() => import("./(modals)/SplitModuleModal"));
const SwitchFormateurModal = dynamic(
  () => import("./(modals)/SwitchFormateurModal")
);

export default function HoverElements() {
  const {
    focus: focusModule,
    temps: tempModules,
    setTempModule,
    setTempModules,
  } = useFocusModule();

  const submitSwitchForm = useCallback(
    async (module?: ModuleEvent) => {
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
    focusModule && (
      <>
        {/* <SwitchFormateurModal
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
        /> */}
      </>
    )
  );
}
