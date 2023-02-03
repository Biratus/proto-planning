"use client";

import { useCallback } from "react";
import { useFocusModule, useHoverActions } from "./(calendar)/CalendarProvider";
import ModuleMenu from "./ModuleMenu";

export default function HoverElements() {
  const focusModule = useFocusModule();
  const { closeMenu } = useHoverActions();

  const switchFormateur = useCallback(() => {
    console.log("switchFormateur", focusModule);
    closeMenu();
  }, [focusModule]);
  const splitModule = useCallback(() => {
    console.log("splitModule", focusModule);
    closeMenu();
  }, [focusModule]);
  return (
    <>
      <ModuleMenu switchFormateur={switchFormateur} splitModule={splitModule} />
    </>
  );
}
