"use client";

import { useRef } from "react";
import { setSwitchPanel } from "./(calendar)/CalendarProvider";
import { SwitchFormateurDrawerId } from "./(hover)/SwitchFormateurModal";

export default function SwitchPanelUI() {
  const switchPanel = useRef<HTMLInputElement>(null);
  setSwitchPanel(switchPanel);
  return (
    <input
      ref={switchPanel}
      id={SwitchFormateurDrawerId}
      type="checkbox"
      className="drawer-toggle"
    />
  );
}
