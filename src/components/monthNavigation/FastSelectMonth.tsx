import { formatMonthYear } from "@/lib/date";
import { addMonths, isSameMonth, subMonths } from "date-fns";
import { useMemo } from "react";
import Dropdown from "../Dropdown";
export default function FastSelectMonth({
  focusedMonth,
  min = 12,
  max = 12,
  onChange,
  disabled = false,
}: {
  focusedMonth: Date;
  min?: number;
  max?: number;
  onChange: (value: Date) => void;
  disabled?: boolean;
}) {
  const months = useMemo(
    () => generateMonthList(min, max, focusedMonth),
    [focusedMonth]
  );

  const monthsActions = months.map((m) => ({
    label: formatMonthYear(m),
    onClick: () => onChange(m),
    selected: isSameMonth(focusedMonth, m),
  }));

  return (
    <Dropdown label="Aller au mois..." actions={monthsActions} compact={true} />
    // <div className="dropdown">
    //   <label
    //     tabIndex={0}
    //     className={`btn m-1 btn-outline ${disabled ? "btn-disabled" : ""}`}
    //   >
    //     <span className="mx-1">Aller au mois...</span>
    //     <ChevronDown />
    //   </label>
    //   <ul
    //     tabIndex={0}
    //     className="dropdown-content menu menu-compact p-2 shadow bg-base-100 rounded-box w-52"
    //   >
    //     {monthsActions.map(({ label, onClick, selected }) => (
    //       <li onClick={onClick} key={label}>
    //         <a className={selected ? `active` : ``}>{label}</a>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  );
}

const generateMonthList = (min: number, max: number, month: Date) => {
  let arr = [];
  for (let i = 0; i < min; i++) {
    arr.push(subMonths(month, min - i));
  }
  arr.push(month);
  for (let i = 0; i < max; i++) {
    arr.push(addMonths(month, i + 1));
  }
  return arr;
};
