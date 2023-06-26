import {
  ClientPutModulesResponse,
  PutModulesResponse,
} from "@/app/api/modules/route";
import axios from "axios";
import { formatISO, parseISO } from "date-fns";
import { deserialize, serialize } from "./date";
import {
  Filiere,
  Formateur,
  Module,
  ModuleHistory,
  Serialized,
  SerializedFiliere,
} from "./types";

export async function fetchMods(): Promise<Module[]> {
  const modResp = await axios.get("/api/modules");
  return modResp.data as Module[];
}

export async function searchFormateurs(params: {
  search?: string;
  able?: Module;
  available?: Interval;
  page?: number;
  count?: number;
  alphabetically?: boolean;
}): Promise<Formateur[]> {
  let parsedParams = { ...params } as any;
  if (params.available) {
    parsedParams = {
      availableFrom: formatISO(params.available.start),
      availableTo: formatISO(params.available.end),
    };
  }
  const formateurs = await axios.get(
    "/api/formateurs?" + new URLSearchParams(parsedParams).toString()
  );
  return formateurs.data as Formateur[];
}

export async function apiFetchFiliere(nomFiliere: string): Promise<Filiere> {
  const resp = await axios.get("/api/filiere/" + nomFiliere);
  const filiere = {
    ...(resp.data as SerializedFiliere),
    modules: (resp.data as SerializedFiliere).modules!.map((m) =>
      deserialize<Module>(m)
    ),
  };

  return filiere;
}

export async function apiCreateModule(module: Module) {
  return axios.post("/api/modules/", serialize(module));
}

export async function apiUpdateModule(module: Module) {
  return apiUpdateModules([module]);
}

export async function apiUpdateModules(modules: Module[]) {
  const resp = await axios.put(
    "/api/modules/",
    modules.map((m) => serialize(m))
  );

  const ret: PutModulesResponse = {
    updated: (resp.data as ClientPutModulesResponse).updated.map((m) => ({
      ...m,
      start: parseISO(m.start),
      end: parseISO(m.end),
    })),
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

export async function apiVersionDowngrade(historyId: number) {
  try {
    const resp = await axios.put("/api/modules/audit/" + historyId);

    return (resp.data as Serialized<ModuleHistory>[]).map((d) =>
      deserialize<ModuleHistory>(d)
    );
  } catch (e: any) {
    return { error: e.response.data.message };
  }
}

// [current,toCreate]
export async function apiSplitModule(modules: Module[]) {
  try {
    const resp = await axios.post(
      "/api/modules/split/",
      modules.map((m) => serialize(m))
    );

    const [created, updated] = resp.data;
    return [deserialize<Module>(created), deserialize<Module>(updated)];
  } catch (e: any) {
    return { error: e.response.data.message };
  }
}
