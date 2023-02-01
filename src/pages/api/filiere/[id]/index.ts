import { NextApiRequest, NextApiResponse } from "next";
import { isGet, notFound } from "../../../../lib/api";
import { modules } from "../../../../lib/realData";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (isGet(req)) {
    return modules.filter((m) => m.filiere == req.query.id);
  }
  return notFound(res, "URL NOT Mapped");
}
