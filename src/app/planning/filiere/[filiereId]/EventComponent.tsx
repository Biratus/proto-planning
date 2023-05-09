import { useLegendStore } from "@/components/legend/Legend";
import { isFormateurMissing } from "@/lib/realData";
import { ComponentForEventProps } from "@/packages/calendar/types";
import { useMemo } from "react";
import { missingFormateurStyle } from "../../(components)/(calendar)/CalendarStyle";
import { ModuleForSingleCalendar } from "./CalendarFiliere";

export default function EventComponent({
  event: module,
  ...props
}: ComponentForEventProps<ModuleForSingleCalendar>) {
  const colorOf = useLegendStore((state) => state.colorOf);

  const wholeStyle = useMemo(
    () =>
      isFormateurMissing(module)
        ? missingFormateurStyle(colorOf(module.theme))
        : {
            className: "",
            props: { backgroundColor: colorOf(module.theme) },
          },
    [module]
  );
  return (
    <div
      className={`${props.className} ${wholeStyle.className} cursor-pointer truncate hover:opacity-60`}
      style={{
        ...props.style,
        ...wholeStyle.props,
      }}
    >
      {module.nom}
    </div>
  );
}
