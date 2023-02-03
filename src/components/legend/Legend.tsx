import { Color, getColorsForLabels } from "@/lib/colors";
import { themes } from "@/lib/realData";
import { create } from "zustand";
import {
  missingFormateurStyle,
  overlapModuleStyle,
  Style,
} from "../calendar/styles";
import LegendUI from "./LegendUI";

export type LegendItem = {
  label: string;
  style: Style;
};

const missingFormateurLegend = {
  label: "Formateur non défini",
  style: missingFormateurStyle("grey"),
};

const overlapModuleLegend = {
  label: "Modules superposés",
  style: overlapModuleStyle,
};
const colors = getColorsForLabels(themes);

const fullLegend: LegendItem[] = [
  missingFormateurLegend,
  overlapModuleLegend,
  ...toLegendItem(themes, colors),
];

export const useLegendStore = create<{
  legendList: LegendItem[];
  showLegend: (themes: string[], includeMissingFormateur?: boolean) => void;
  colorOf: (label: string) => string;
}>((set) => ({
  legendList: fullLegend,
  showLegend: (themes: string[], includeMissingFormateur = false) =>
    set(() => ({
      legendList: themes
        ? [
            ...fullLegend.filter(
              (l) =>
                themes.includes(l.label) ||
                (includeMissingFormateur &&
                  l.label == missingFormateurLegend.label)
            ),
          ]
        : fullLegend,
    })),
  colorOf: (label: string) => colors.get(label)!.rgb,
}));

export default function Legend({}) {
  const legendList = useLegendStore.getState().legendList;
  return <LegendUI legendList={legendList} />;
}

function toLegendItem(themes: string[], colors: Map<string, Color>) {
  return themes.map((t) => ({
    label: t,
    style: {
      className: "",
      props: {
        backgroundColor: colors.get(t)!.rgb,
      },
    },
  }));
}
