import {
  ClientPutModulesResponse,
  PutModulesResponse,
} from "@/app/api/modules/route";
import axios from "axios";
import { formatISO, parseISO } from "date-fns";
import { deserialize } from "./date";
import { SimpleHistory } from "./db/ModuleAuditRepository";
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
export async function apiUpdateModule(module: Module) {
  const resp = await axios.put("/api/modules/", module);

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

export async function apiUpdateModules(modules: Module[]) {
  const resp = await axios.put("/api/modules/", modules);

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
