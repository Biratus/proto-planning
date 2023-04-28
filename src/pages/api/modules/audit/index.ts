import { isGet, ok } from "@/lib/api";
import { getModulesHistory } from "@/lib/db/ModuleAuditRepository";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (isGet(req)) {
    let page;
    let recordPerPage;

    if (req.query.page && !isNaN(parseInt(req.query.page as string)))
      page = parseInt(req.query.page as string);
    if (req.query.count && !isNaN(parseInt(req.query.count as string)))
      recordPerPage = parseInt(req.query.count as string);

    const rawHistory = await getModulesHistory(page, recordPerPage);

    // const currentModules = await getModules(
    //   Array.from(new Set(rawHistory.map((m) => m.module_id)))
    // );

    // const history: (module | module_audit)[][] = [];

    // for (let mod of currentModules) {
    //   history.push([mod, ...rawHistory.filter((m) => m.module_id == mod.id)]);
    // }

    return ok(res, rawHistory);
  }
}
