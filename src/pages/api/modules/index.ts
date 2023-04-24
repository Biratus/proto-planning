import { isValid, mapISO } from "@/lib/date";
import { createModule, updateModule } from "@/lib/db/ModuleRepository";
import { Module, SerializedModule } from "@/lib/types";
import { NextApiRequest, NextApiResponse } from "next";
import {
  isGet,
  isPost,
  isPut,
  ok,
  requestError,
  serverError,
} from "../../../lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (isGet(req)) {
    // return ok(res, modules);
  } else if (isPut(req)) {
    let serializedMod = req.body as SerializedModule;
    if (!serializedMod.id) return requestError(res, "No id was provided");

    if (!isValidModule(serializedMod)) {
      return requestError(res, "Invalid dates");
    }

    try {
      let [mod] = mapISO<Module>([serializedMod], ["start", "end"]);
      const dbRes = await updateModule(mod);
      return ok(res, dbRes);
    } catch (e: any) {
      return serverError(res, e.message);
    }
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
