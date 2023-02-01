import { NextApiRequest, NextApiResponse } from "next";
import { isGet, isPut, ok } from "../../../lib/api";
import { modules } from "../../../lib/realData";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (isGet(req)) {
    return ok(res, modules);
  } else if (isPut(req)) {
    let mod = req.body;

    for (let index in modules) {
      if (modules[index].id == mod.id) {
        modules[index] = mod;
        break;
      }
    }
    return ok(res,{});
  }
}
