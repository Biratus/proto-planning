import { isValid, mapISO } from "@/lib/date";
import { createModule, updateModules } from "@/lib/db/ModuleRepository";
import { Module, SerializedModule } from "@/lib/types";
import { NextApiRequest, NextApiResponse } from "next";
import { isGet, isPost, isPut, ok, requestError } from "../../../lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (isGet(req)) {
    // return ok(res, modules);
  } else if (isPut(req)) {
    return putModules(req.body, res);
  } else if (isPost(req)) {
    let serializedMod = req.body as SerializedModule;

    if (!isValidModule(serializedMod)) {
      return requestError(res, "Invalid dates");
    }

    try {
      let [mod] = mapISO<Module>([serializedMod], ["start", "end"]);
      const dbRes = await createModule(mod);
      return ok(res, dbRes);
    } catch (e) {
      throw e;
    }
  }
}

function isValidModule(mod: SerializedModule) {
  return isValid(mod.start as string) && isValid(mod.end as string);
}

async function putModules(reqBody: any, res: NextApiResponse) {
  let serializedModules: SerializedModule[] = [];

  if (!(reqBody instanceof Array)) {
    serializedModules.push(reqBody as SerializedModule);
  } else serializedModules = reqBody as SerializedModule[];

  for (let serializedMod of serializedModules) {
    if (!serializedMod.id) return requestError(res, "No id was provided");

    if (!isValidModule(serializedMod)) {
      return requestError(res, "Invalid dates");
    }
  }

  const modulesToUpdate = mapISO<Module>(serializedModules, ["start", "end"]);
  const dbResp = await updateModules(modulesToUpdate);

  const response: PutModulesResponse = {
    updated: [],
    errors: [],
  };

  for (let resp of dbResp) {
    if ("error" in resp) response.errors.push(resp);
    else response.updated.push(resp[0]);
  }

  return ok(res, response);
}

export type PutModulesResponse = {
  updated: Partial<Module>[];
  errors: { error: any; module: Partial<Module> }[];
};

export type ClientPutModulesResponse = {
  updated: Partial<SerializedModule>[];
  errors: { error: any; module: Partial<SerializedModule> }[];
};
