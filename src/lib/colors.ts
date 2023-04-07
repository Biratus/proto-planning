import distinctColors from "distinct-colors";

export type Color = {
  r: number;
  g: number;
  b: number;
  rgb: string;
};

export function allColorsForThemes() {
  return getColorsForLabels([
    "COMPORTEMENTAL",
    "JAVA",
    "FONDAMENTAUX ET BASE DE DONNEES",
    "WEB",
    "METHODES ET OUTILS",
    "FRAMEWORKS",
    "PROJET",
  ]);
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

  return new Map(labelList.map((label, i) => [label, arr[i]]));
}

export function getGrayscaleForLabels(labelList: string[]) {
  let arr = distinctColors({
    count: labelList.length,
    chromaMin: 0,
    chromaMax: 1,
  }).map((color) => {
    let [r, g, b] = color.rgb();
    return {
      r,
      g,
      b,
      rgb: `rgb(${r.toFixed(2)},${g.toFixed(2)},${b.toFixed(2)})`,
    };
  });

  return new Map(labelList.map((label, i) => [label, arr[i]]));
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

export function isDark({ r, g, b }: Color) {
  const yiq = (r * 2126 + g * 7152 + b * 722) / 10000;
  return yiq < 128;
}
