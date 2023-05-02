import { Module, SerializedModule } from "./types";

export const isFormateurMissing = (mod: Module | SerializedModule) => {
  return mod.formateur == undefined;
};

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
