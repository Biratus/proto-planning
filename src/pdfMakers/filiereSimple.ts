import { Formateur, Module } from "@/lib/types";
import { eachDayOfInterval, isSameMonth } from "date-fns";
import { moduleDayLabel } from "../lib/calendar/calendar";
import { allColorsForThemes } from "../lib/colors";
import { formatMonthYear } from "../lib/date";
import { objectToCSS } from "../lib/pdf";
import { isFormateurMissing } from "../lib/realData";

export default function htmlFromFiliere(
  filiereId: string,
  modules: Omit<Module, "filiere">[]
) {
  // Building table rows
  let currMonth = modules[0].start;
  let indexToAdd = 0;
  let objToAdd = null;
  const tableBody = [];

  for (let mod of modules) {
    let { end } = mod;
    if (objToAdd == null) {
      // First one
      objToAdd = rowFromModule(mod, true);
    } else if (!isSameMonth(currMonth, end)) {
      // Month changed
      tableBody.splice(indexToAdd, 0, objToAdd);
      objToAdd = rowFromModule(mod, true);
      currMonth = end;
      indexToAdd = tableBody.length;
    } else {
      // Simple
      tableBody.push(rowFromModule(mod));
      objToAdd[0].rowSpan++;
    }
  }
  tableBody.splice(indexToAdd, 0, objToAdd!);

  // Bulding PDF
  let colors = allColorsForThemes();
  let styles = {
    "*": {
      "font-size": "Roboto Tahoma Helvetica sans-serif",
      "box-sizing": "border-box",
    },
    table: {
      width: "90%",
      margin: "auto",
      "font-size": "0.6rem",
      "border-spacing": 0,
    },
    h2: {
      "text-align": "center",
    },
    ".bg-grey": {
      "background-color": "#aaa",
    },
    td: {},
    ".month": {
      "font-weight": "bold",
      "font-size": "1.2em",
      color: "#18263B",
      background:
        "linear-gradient(-120deg, hsl(47, 49%, 61%) 0%, hsl(47, 49%, 61%) 19%, rgb(255,255,255) 80%)",
    },
    ".month div": {
      "writing-mode": "vertical-rl",
      "vertical-align": "top",
      display: "inline-block",
      transform: "rotate(-180deg)",
      "padding-left": "0.5em",
    },
    ".day": {
      "border-bottom": "1px solid gray",
      "text-align": "center",
    },
    ".module": {
      "padding-left": "1em",
      overflow: "hidden",
      "white-space": "nowrap",
      "text-overflow": "ellipsis",
    },
    ".formateur": {
      "border-bottom": "1px solid gray",
      "padding-left": "1em",
    },
    ".missing": {
      color: "red",
    },
  };
  for (let theme of colors.keys()) {
    /**@ts-ignore */
    styles[`.${theme.replaceAll(" ", "_")}`] = {
      "background-color": colors.get(theme)!.rgb,
    };
  }

  function rowToHtml([month, day, mod, formateur]: any[]) {
    let { nom, start, end, theme } = mod as Module;
    let dayNb = eachDayOfInterval({ start, end }).length;
    return `<tr style="height:${dayNb * 1.5}em">
    ${
      month
        ? `<td rowspan="${month.rowSpan}" class="month"><div>${month.text}</div></td>`
        : ""
    }
    <td class="day">${day}</td>
    <td class="module ${theme.replaceAll(" ", "_")}">${nom}</td>
    <td class="formateur ${
      isFormateurMissing(mod) ? "missing" : ""
    }">${formateur}</td>
  </tr>
  `;
  }
  // Table rows built
  return `
    <style>
      ${objectToCSS(styles)}
    </style>
    <h2>${filiereId}</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th class="bg-grey">Module</th>
            <th class="bg-grey">Formateur</th>
          </tr>
        </thead>
        <tbody>
        ${tableBody.reduce((acc, row) => acc + rowToHtml(row), "")}
        </tbody>
      </table>
    `;
}

function rowFromModule(
  mod: { start: Date; end: Date; formateur?: Formateur | null },
  withMonth = false
): any[] {
  let { end, formateur } = mod;
  let dayLabel = moduleDayLabel(mod);

  return [
    withMonth ? { rowSpan: 1, text: formatMonthYear(end) } : "",
    dayLabel,
    mod,
    formateur ? `${formateur.prenom} ${formateur.nom.toUpperCase()}` : "N/A",
  ];
}
