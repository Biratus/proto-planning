"use client";
import cn from "classnames";
import { useCallback, useEffect, useRef } from "react";
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
  const activeRef = useRef<HTMLLIElement>(null);

  const itemClick = useCallback(
    (key: string, onClick: (key: string) => void) => {
      onClick(key);
      /**@ts-ignore */
      document.activeElement!.blur();
    },
    []
  );

  useEffect(() => {
    activeRef.current?.scrollIntoView();
  }, [actions]);

  return (
    <div className="dropdown">
      <label tabIndex={0} className="btn-outline btn m-1">
        <span className="mx-1">{label}</span>
        <ChevronDown />
      </label>
      <ul
        tabIndex={0}
        className={cn({
          "dropdown-content menu rounded-box max-h-96 w-full snap-y flex-nowrap overflow-y-scroll bg-base-100 p-2 shadow":
            true,
          "menu-compact": compact,
        })}
      >
        {actions.map(({ label, onClick, selected }, i) =>
          selected ? (
            <li
              onClick={(evt) => itemClick(label, onClick)}
              key={i}
              ref={activeRef}
              className="snap-start"
            >
              <a className="active">{label}</a>
            </li>
          ) : (
            <li
              onClick={(evt) => itemClick(label, onClick)}
              key={i}
              className="snap-start"
            >
              <a>{label}</a>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
