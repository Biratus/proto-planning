import {
  ClientPutModulesResponse,
  PutModulesResponse,
} from "@/pages/api/modules";
import axios from "axios";
import { formatISO, parseISO } from "date-fns";
import { isValid, mapISO } from "./date";
import { SimpleHistory } from "./db/ModuleAuditRepository";
import {
  Filiere,
  Formateur,
  Module,
  ModuleHistory,
  Serialized,
  SerializedFiliere,
} from "./types";

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

export async function apiFetchFiliere(nomFiliere: string): Promise<Filiere> {
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

export async function apiUpdateModules(modules: Module[]) {
  const resp = await axios.put("/api/modules/", modules);

  const ret: PutModulesResponse = {
    updated: mapISO<Module>((resp.data as ClientPutModulesResponse).updated, [
      "start",
      "end",
    ]),
    errors: (resp.data as ClientPutModulesResponse).errors.map((err) => ({
      error: err.error,
      module: {
        ...err.module,
        start: parseISO(err.module.start as string),
        end: parseISO(err.module.end as string),
      },
    })),
  };

  return ret;
}

export async function apiHistoryModules(page = 1, count = 20) {
  try {
    const resp = await axios.get(
      "/api/modules/audit?" +
        new URLSearchParams({
          page: page.toString(),
          count: count.toString(),
        }).toString()
    );
    return resp.data as SimpleHistory[];
  } catch (e) {
    throw e;
  }
}
export async function apiHistoryModule(module_id: number) {
  try {
    const resp = await axios.get("/api/modules/audit/" + module_id);
    return (resp.data as Serialized<ModuleHistory>[]).map((d) =>
      deserialize<ModuleHistory>(d)
    );
  } catch (e) {
    throw e;
  }
}

export async function apiVersionDowngrade(historyId: number) {
  try {
    const resp = await axios.put("/api/modules/audit/" + historyId);

    return (resp.data as Serialized<ModuleHistory>[]).map((d) =>
      deserialize<ModuleHistory>(d)
    );
  } catch (e: any) {
    return { error: e.message };
  }
}

function deserialize<T>(serialized: Serialized<T>): T {
  const result = Object.create(Object.getPrototypeOf(serialized)) as T;
  for (const key in serialized) {
    if (serialized.hasOwnProperty(key)) {
      const value = serialized[key];
      if (typeof value === "string" && isValid(value)) {
        result[key as keyof T] = parseISO(value) as any;
      } else {
        result[key as keyof T] = value as any;
      }
    }
  }
  return result;
}
