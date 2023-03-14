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

export function colorFromZones(zones: string[], colors: Map<string, Color>) {
  if (zones.length == 1) return colors.get(zones[0])!.rgb;
  else {
    let gradient = `linear-gradient(30deg, `;
    zones.forEach((zone, index) => {
      // Add the color associated with the current zone to the gradient
      gradient += `${colors.get(zone)!.rgb} ${
        (100 / (zones.length - 1)) * index
      }%, `;
    });
    // Remove the last comma and space, and add the closing parentheses
    gradient = gradient.slice(0, -2) + ")";
    return gradient;
  }
}
