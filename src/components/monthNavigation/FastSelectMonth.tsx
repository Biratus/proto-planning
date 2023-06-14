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
    [min, max, focusedMonth]
  );

  const monthsActions = months.map((m) => ({
    label: formatMonthYear(m),
    key: m,
    selected: isSameMonth(focusedMonth, m),
  }));

  return (
    <Dropdown
      label="Aller au mois..."
      actions={monthsActions}
      compact={true}
      onClick={onChange}
    />
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
