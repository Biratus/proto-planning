import distinctColors from "distinct-colors";
import { modules } from "./realData";

export type Color = {
  r: number;
  g: number;
  b: number;
  rgb: string;
};

export function allColorsForThemes() {
  return getColorsForLabels(modules.map((m) => m.theme));
}

export function getColorsForLabels(labelList: string[]) {
  let labels = [...new Set(labelList)];

  let arr = distinctColors({
    count: labels.length,
    chromaMin: 50,
    lightMin: 20,
    lightMax: 80,
  }).map((color) => {
    let [r, g, b] = color.rgb();
    return {
      r,
      g,
      b,
      rgb: `rgb(${r.toFixed(2)},${g.toFixed(2)},${b.toFixed(2)})`,
    };
  });

  let colors = new Map<string, Color>();

  for (let i in labels) {
    colors.set(labels[i], arr[i]);
  }
  return colors;
}
