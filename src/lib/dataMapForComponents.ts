import { Formateur } from "./types";

export function formateurForFields(formList: Map<string, Formateur>) {
  let arr = [];
  for (let email in formList.keys()) {
    let { nom, prenom } = formList.get(email)!;
    arr.push({ label: `${nom} ${prenom}`, id: email });
  }
  return arr;
}
