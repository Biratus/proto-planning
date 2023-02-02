import { Style } from "../calendar/styles";
import { LegendItem } from "./Legend";

export default function LegendUI({ legendList }: { legendList: LegendItem[] }) {
  return (
    <div className="bg-white border-gray-600 border p-1 m-5 rounded-lg">
      <h3 className="m-1">Légende des modules</h3>
      <div className="grid gap-1 grid-cols-2">
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
    <div className="flex flex-row gap-2 items-center">
      <span
        className={`w-4 h-4 rounded ${styleProps.className}`}
        style={styleProps.props}
      ></span>
      <span>{label}</span>
    </div>
  );
}
