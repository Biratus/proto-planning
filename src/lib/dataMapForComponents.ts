import { formateurs } from "./realData";

export function formateurForFields(formList = formateurs) {
  let arr = [];
  for (let email in formList.keys()) {
    let { nom, prenom } = formList.get(email)!;
    arr.push({ label: `${nom} ${prenom}`, id: email });
  }
  return arr;
}
