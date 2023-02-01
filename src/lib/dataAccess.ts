import axios from "axios";
import { Formateur, Module } from "./types";

export async function switchFormateur(newModule:Module) {
  try {
    const response = await axios.put("/api/modules", newModule);
    return true;
  } catch (e) {
    return false;
  }
}

// TODO !!!!
export async function splitModule({ split, formateurs }:{split:any,formateurs:Formateur[]}) {
//   try {
//     await axios.put("/api/modules/" + hoverProps.module.id, {
//       split,
//       formateurs: formateurs.map((f) => {
//         return { mail: f.id };
//       }),
//     });
//     return true;
//   } catch (e) {
//     return false;
//   }
}

export async function fetchMods():Promise<Module[]> {
  const modResp = await axios.get("/api/modules");
  return modResp.data as Module[];
}
