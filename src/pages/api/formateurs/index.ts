import { NextApiRequest, NextApiResponse } from "next";
import { isGet, ok, parseBool } from "../../../lib/api";
import { formateurs } from "../../../lib/realData";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (isGet(req)) {
    let available = parseBool(req.query.available as string);
    let able = parseBool(req.query.able as string);

    // do something

    return ok(res, formateurs);
  }
}
