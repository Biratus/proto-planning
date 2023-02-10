import { Style } from "../calendar/styles";
import { LegendItem } from "./Legend";

export default function LegendUI({ legendList }: { legendList: LegendItem[] }) {
  return (
    <div className="m-5 rounded-lg border border-gray-600 bg-white p-1">
      <h3 className="m-1">Légende des modules</h3>
      <div className="grid grid-cols-2 gap-1">
        {legendList.map(({ label, style }) => (
          <LegendItem key={label} styleProps={style} label={label} />
        ))}
      </div>
    </div>
  );
}

function LegendItem({
  styleProps,
  label,
}: {
  styleProps: Style;
  label: string;
}) {
  return (
    <div className="flex flex-row items-center gap-2">
      <span
        className={`h-4 w-4 rounded ${styleProps.className}`}
        style={styleProps.props}
      ></span>
      <span>{label}</span>
    </div>
  );
}
