"use client";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useRef } from "react";
import { User, Users } from "react-feather";
import {
  useHoverActions,
  usePopUpMenuProps,
} from "./(calendar)/CalendarProvider";

type ModuleMenuProps = {
  switchFormateur: () => void;
  splitModule: () => void;
};

export default function ModuleMenu({
  switchFormateur,
  splitModule,
}: ModuleMenuProps) {
  const { menuOpen: visible, anchor } = usePopUpMenuProps();
  const { closeMenu } = useHoverActions();
  const menuRef = useRef<HTMLUListElement>(null);

  useOnClickOutside(menuRef, closeMenu);
  return (
    <ul
      className={`menu bg-base-100 w-56 rounded-box shadow-2xl ${
        visible ? "" : "hidden"
      } absolute ml-2 border border-gray-600 p-1`}
      style={{
        top: anchor ? anchor.offsetTop + anchor.clientHeight : 0,
        left: anchor ? `${anchor.offsetLeft + 4}px` : 0,
      }}
      ref={menuRef}
    >
      <li onClick={switchFormateur}>
        <a>
          <User className="mr-1" />
          Modifier le formateur
        </a>
      </li>
      <li onClick={splitModule}>
        <a>
          <Users className="mr-1" />
          Scinder le module
        </a>
      </li>
    </ul>
  );
}
/*
const menuItems = useMemo(() => [
    {
      icon: <SwapHorizIcon />,
      text: "Modifier le formateur",
      onClick: () => hoverDispatch({ type: "SWITCH_FORM" }),
    },
    {
      icon: <SafetyDividerIcon />,
      text: "Scinder le module",
      onClick: () => hoverDispatch({ type: "SPLIT_MODULE" }),
    },
  ]);
  */
