import { badRequest, isValidModule, ok, serverError } from "@/lib/api";
import { deserialize } from "@/lib/date";
import { createModule_async, updateModules } from "@/lib/db/ModuleRepository";
import { Module, SerializedModule } from "@/lib/types";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  let serializedModules: SerializedModule[] = [];
  const body = await request.json();

  if (!(body instanceof Array)) {
    serializedModules.push(body as SerializedModule);
  } else serializedModules = body as SerializedModule[];

  for (let serializedMod of serializedModules) {
    if (!serializedMod.id) return badRequest("No id was provided");
    if (!isValidModule(serializedMod)) {
      return badRequest("Invalid dates");
    }
  }

  const modulesToUpdate = serializedModules.map((m) => deserialize<Module>(m));
  const dbResp = await updateModules(modulesToUpdate);
  const response: PutModulesResponse = {
    updated: [],
    errors: [],
  };
  for (let resp of dbResp) {
    if ("error" in resp) response.errors.push(resp);
    else response.updated.push(resp[0]);
  }
  return ok(response);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!(body instanceof Object)) {
    return badRequest("Invalid body");
  }
  try {
    let serializedMod = body as SerializedModule;

    if (!isValidModule(serializedMod)) {
      return badRequest("Invalid dates");
    }

    try {
      const dbRes = await createModule_async(
        deserialize<Module>(serializedMod)
      );
      return ok(dbRes);
    } catch (e) {
      return serverError("Création de module");
    }
  } catch (e) {
    return badRequest("Invalid body");
  }
}

export type PutModulesResponse = {
  updated: Partial<Module>[];
  errors: { error: any; module: Partial<Module> }[];
};

export type ClientPutModulesResponse = {
  updated: SerializedModule[];
  errors: { error: any; module: Partial<SerializedModule> }[];
};
