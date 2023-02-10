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
      <label tabIndex={0} className="btn-outline btn m-1">
        <span className="mx-1">{label}</span>
        <ChevronDown />
      </label>
      <ul
        tabIndex={0}
        className={`dropdown-content menu rounded-box max-h-96 flex-nowrap overflow-y-scroll bg-base-100 p-2 shadow ${
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
