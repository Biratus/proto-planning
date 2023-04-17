import { Interval } from "@/packages/calendar/types";
import { isAfter, isBefore, isWithinInterval } from "date-fns";
import { Module, SerializedModule } from "./types";

export const isFormateurMissing = (mod: Module | SerializedModule) => {
  return mod.formateur == undefined;
};

// export function filterFormateur({
//   search,
//   available,
//   able,
// }: {
//   search?: string;
//   available?: Interval;
//   able?: Module;
// }): Formateur[] {
//   let filtered = [];
//   for (let form of formateurMap.values()) {
//     let satisfies = true;
//     if (
//       search &&
//       !includesIgnoreCase(form.nom, search) &&
//       !includesIgnoreCase(form.prenom, search)
//     )
//       satisfies = false;
//     // if(available && !formateurAvailable(form,available)) satisfies = false; // Wait for BDD
//     // if(able && !formateurAble(form,able)) satisfies = false; // Wait for BDD

//     if (satisfies) filtered.push(form);
//   }
//   return filtered;
// }

export const themes = [
  "COMPORTEMENTAL",
  "JAVA",
  "FONDAMENTAUX ET BASE DE DONNEES",
  "WEB",
  "METHODES ET OUTILS",
  "FRAMEWORKS",
  "PROJET",
];

/*
  --------
    UTILS
  --------
*/

export function getOverlapModules(
  modules: Module[]
): (Interval & { overlappedModules: Module[] })[] {
  let overlappedModules: Module[][] = [];

  for (let mod1 of modules) {
    for (let mod2 of modules) {
      if (mod1.id !== mod2.id && moduleOverlap(mod1, mod2)) {
        if (
          !overlappedModules.some((overlapped) => overlapped.includes(mod1))
        ) {
          overlappedModules.push([mod1, mod2]);
        } else {
          const overlappIndex = overlappedModules.findIndex((overlapped) =>
            overlapped.includes(mod1)
          );
          overlappedModules[overlappIndex].push(mod2);
        }
      }
    }
  }

  return overlappedModules.map((mods) => ({
    start: mods.reduce(
      (acc: Date | null, m) =>
        (acc = acc == null || isBefore(m.start, acc) ? m.start : acc),
      null
    )!,
    end: mods.reduce(
      (acc: Date | null, m) =>
        (acc = acc == null || isAfter(m.end, acc) ? m.end : acc),
      null
    )!,
    overlappedModules: sortModules(mods),
  }));
}

export function moduleOverlap(m1: Module, m2: Module) {
  return isWithinInterval(m1.start, m2) || isWithinInterval(m1.end, m2);
}

export function sortModules(modules: Module[]) {
  return modules.sort((m1, m2) => m1.start.getTime() - m2.start.getTime());
}
