"use client";
import { useCallback, useRef } from "react";
import { ChevronDown } from "react-feather";

type DropdownAction = {
  label: string;
  onClick: (key: string) => void;
  selected: boolean;
};
export default function Dropdown({
  label,
  actions,
  compact = false,
}: {
  label: string;
  actions: DropdownAction[];
  compact?: boolean;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemClick = useCallback(
    (key: string, onClick: (key: string) => void) => {
      onClick(key);
      /**@ts-ignore */
      document.activeElement!.blur();
    },
    []
  );
  return (
    <div className="dropdown" ref={dropdownRef}>
      <label tabIndex={0} className="btn m-1 btn-outline">
        <span className="mx-1">{label}</span>
        <ChevronDown />
      </label>
      <ul
        tabIndex={0}
        className={`dropdown-content menu p-2 shadow bg-base-100 rounded-box flex-nowrap max-h-96 overflow-y-scroll ${
          compact ? "menu-compact" : ""
        }`}
      >
        {actions.map(({ label, onClick, selected }, i) => (
          <li onClick={(evt) => itemClick(label, onClick)} key={i}>
            <a className={selected ? `active` : ``}>{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
