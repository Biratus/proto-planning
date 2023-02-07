"use client";

import { Formateur, Module } from "@/lib/types";
import { useCallback } from "react";
import {
  resetHoverProps,
  useFocusModule,
  useHoverActions,
} from "../(calendar)/CalendarProvider";
import ModuleMenu from "./ModuleMenu";
import SplitModuleModal from "./SplitModuleModal";
import SwitchFormateurModal from "./SwitchFormateurModal";

export default function HoverElements() {
  const focusModule = useFocusModule();
  const { closeMenu } = useHoverActions();
  // console.log("HoverElements", focusModule);

  const switchFormateur = useCallback(() => {
    console.log("switchFormateur", focusModule);
    closeMenu();
  }, [focusModule]);

  const splitModule = useCallback(() => {
    console.log("splitModule", focusModule);
    closeMenu();
  }, [focusModule]);

  const submitSwitchForm = useCallback(
    async (module?: Module) => {
      console.log("submitSwitchForm");
      console.log({ focusModule, module });
      // if(success)
      resetHoverProps();
      return true;
    },
    [focusModule]
  );
  const submitSplitForm = useCallback(
    async ({ split, formateurs }: { split: Date; formateurs: Formateur[] }) => {
      console.log("submitSplitForm");
      console.log({ split, formateurs });
      // if(success)
      resetHoverProps();
      return true;
    },
    [focusModule]
  );
  return (
    <>
      <ModuleMenu switchFormateur={switchFormateur} splitModule={splitModule} />
      <SwitchFormateurModal
        onClose={resetHoverProps}
        module={focusModule}
        submit={submitSwitchForm}
      />
      <SplitModuleModal
        onClose={resetHoverProps}
        module={focusModule}
        submit={submitSplitForm}
      />
    </>
  );
}
