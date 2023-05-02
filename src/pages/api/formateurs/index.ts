import { searchFormateurs } from "@/lib/db/dataAccess";
import { parseISO } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { isGet, ok } from "../../../lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (isGet(req)) {
    let search = req.query.search as string | undefined;
    let availableFrom = req.query.availableFrom
      ? parseISO(req.query.availableFrom as string)
      : null;
    let availableTo = req.query.availableTo
      ? parseISO(req.query.availableTo as string)
      : null;
    let available =
      availableFrom && availableTo
        ? { start: availableFrom, end: availableTo }
        : undefined;
    // do something
    const formateurs = await searchFormateurs({ search, available });
    return ok(res, formateurs);
  }
}
