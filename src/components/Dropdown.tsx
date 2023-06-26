import cn from "classnames";
import { useCallback, useEffect, useRef } from "react";
import { ChevronDown } from "react-feather";

type DropdownAction<T> = {
  key: T;
  label: string;
  selected: boolean;
};
export default function Dropdown<T>({
  label,
  actions,
  compact = false,
  onClick,
}: {
  label: string;
  actions: DropdownAction<T>[];
  onClick: (key: T) => void;
  compact?: boolean;
}) {
  const activeRef = useRef<HTMLLIElement>(null);

  const itemClick = useCallback(
    (key: T) => {
      onClick(key);
      /**@ts-ignore */
      document.activeElement!.blur();
    },
    [onClick]
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
        {actions.map(({ label, key, selected }, i) =>
          selected ? (
            <li
              onClick={(evt) => itemClick(key)}
              key={i}
              ref={activeRef}
              className="snap-start"
            >
              <a className="active">{label}</a>
            </li>
          ) : (
            <li
              onClick={(evt) => itemClick(key)}
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
