import { ok } from "@/lib/api";
import { getModulesHistory } from "@/lib/db/ModuleAuditRepository";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageStr = searchParams.get("page");
  const count = searchParams.get("count");
  let page;
  let recordPerPage;
  if (pageStr && !isNaN(parseInt(pageStr as string)))
    page = parseInt(pageStr as string);
  if (count && !isNaN(parseInt(count as string)))
    recordPerPage = parseInt(count as string);

  const rawHistory = await getModulesHistory(page, recordPerPage);

  // const currentModules = await getModules(
  //   Array.from(new Set(rawHistory.map((m) => m.module_id)))
  // );

  // const history: (module | module_audit)[][] = [];

  // for (let mod of currentModules) {
  //   history.push([mod, ...rawHistory.filter((m) => m.module_id == mod.id)]);
  // }

  return ok(rawHistory);
}
