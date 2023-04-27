import { isPut, ok, requestError, serverError } from "@/lib/api";
import { moduleVersionDowngrade } from "@/lib/db/ModuleRepository";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (isPut(req)) {
    if (isNaN(parseInt(req.query.id as string))) {
      return requestError(res, "Id is not a number");
    }

    try {
      const updated = await moduleVersionDowngrade(
        parseInt(req.query.id as string)
      );
      return ok(res, updated);
    } catch (e) {
      console.error(e);
      return serverError(
        res,
        "Failed to revert back to history [" + req.query.id + "]"
      );
    }
  }
}
