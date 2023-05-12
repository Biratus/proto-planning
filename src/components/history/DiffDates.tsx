import { formatFullPrettyDate } from "@/lib/date";
import { Interval } from "@/packages/calendar/types";
import cn from "classnames";
import { isSameDay } from "date-fns";

export default function DiffDates({
  before,
  after,
  className,
}: { before: Interval; after: Interval } & React.HTMLAttributes<HTMLElement>) {
  const sameDate =
    isSameDay(after.start, before.start) && isSameDay(after.end, before.end);
  return (
    <div
      className={cn(`flex items-center gap-4 ${className}`, {
        "group-hover:visible": sameDate,
        invisible: sameDate,
      })}
    >
      <span>
        <p>Du {formatFullPrettyDate(before.start)}</p>
        <p>au {formatFullPrettyDate(before.end)}</p>
      </span>
      <span>&rarr;</span>
      <span
        className={cn({
          "font-bold": !sameDate,
        })}
      >
        <p>Du {formatFullPrettyDate(after.start)}</p>
        <p>au {formatFullPrettyDate(after.end)}</p>
      </span>
    </div>
  );
}
