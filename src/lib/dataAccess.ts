import axios from "axios";
import { formatISO } from "date-fns";
import { mapISO } from "./date";
import { Filiere, Formateur, Module, SerializedFiliere } from "./types";

export async function switchFormateur(newModule: Module) {
  try {
    const response = await axios.put("/api/modules", newModule);
    return true;
  } catch (e) {
    return false;
  }
}

// TODO !!!!
export async function splitModule({
  split,
  formateurs,
}: {
  split: any;
  formateurs: Formateur[];
}) {
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

export async function fetchMods(): Promise<Module[]> {
  const modResp = await axios.get("/api/modules");
  return modResp.data as Module[];
}

export async function searchFormateurs(params: {
  able?: Module;
  available?: Interval;
}): Promise<Formateur[]> {
  let parsedParams = { ...params } as any;
  if (params.available) {
    parsedParams = {
      availableFrom: formatISO(params.available.start),
      availableTo: formatISO(params.available.end),
    };
  }
  console.log({ parsedParams });
  const formateurs = await axios.get(
    "/api/formateurs?" + new URLSearchParams(parsedParams).toString()
  );
  return formateurs.data as Formateur[];
}

export async function fetchFiliere(nomFiliere: string): Promise<Filiere> {
  const resp = await axios.get("/api/filiere/" + nomFiliere);
  const filiere = {
    ...(resp.data as SerializedFiliere),
    modules: mapISO<Module>((resp.data as SerializedFiliere).modules!, [
      "start",
      "end",
    ]),
  };

  return filiere;
}
