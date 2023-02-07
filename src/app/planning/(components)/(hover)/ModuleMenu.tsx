"use client";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useRef } from "react";
import { User, Users } from "react-feather";
import { setPopUpMenu, usePopUpMenu } from "../(calendar)/CalendarProvider";
import { SplitModuleModalId } from "./SplitModuleModal";
import { SwitchFormateurModalId } from "./SwitchFormateurModal";

type ModuleMenuProps = {
  switchFormateur: () => void;
  splitModule: () => void;
};

export default function ModuleMenu({
  switchFormateur,
  splitModule,
}: ModuleMenuProps) {
  const { anchor, close } = usePopUpMenu();
  const menuRef = useRef<HTMLUListElement>(null);
  const initilized = useRef(false);
  if (!initilized.current) {
    setPopUpMenu(menuRef);
    initilized.current = true;
  }
  useOnClickOutside(menuRef, close);

  const closeAndAct = (act: () => void) => {
    close();
    act();
  };

  return (
    <ul
      className={`menu bg-base-100 w-56 rounded-box shadow-2xl absolute ml-2 border border-gray-600 p-1 hidden`}
      style={{
        top: anchor ? anchor.offsetTop + anchor.clientHeight : 0,
        left: anchor ? `${anchor.offsetLeft + 4}px` : 0,
      }}
      ref={menuRef}
    >
      <li>
        <label
          htmlFor={SwitchFormateurModalId}
          onClick={() => closeAndAct(switchFormateur)}
        >
          <User className="mr-1" />
          Modifier le formateur
        </label>
      </li>
      <li onClick={splitModule}>
        <label
          htmlFor={SplitModuleModalId}
          onClick={() => closeAndAct(splitModule)}
        >
          <Users className="mr-1" />
          Scinder le module
        </label>
      </li>
    </ul>
  );
}
