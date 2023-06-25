import { badRequest, ok, serverError } from "@/lib/api";
import { getModuleHistory } from "@/lib/db/ModuleAuditRepository";
import { getModule, moduleVersionDowngrade } from "@/lib/db/ModuleRepository";
import { NextRequest } from "next/server";

export async function PUT(
  _: NextRequest,
  { params: { id: idStr } }: { params: { id: string } }
) {
  const id = parseInt(idStr);

  if (isNaN(id)) {
    return badRequest("Id is not a number");
  }
  try {
    await moduleVersionDowngrade(id);

    const moduleHistory = await getModuleHistory(id);
    return ok(moduleHistory);
  } catch (e) {
    console.error(e);
    return serverError("Failed to revert back to history [" + id + "]");
  }
}

export async function GET(
  _: NextRequest,
  { params: { id: idStr } }: { params: { id: string } }
) {
  const id = parseInt(idStr);
  if (isNaN(id)) {
    return badRequest("Id is not a number");
  }
  try {
    const moduleHistory = await getModuleHistory(id);
    const currentModule = await getModule(moduleHistory[0].module_id, {
      formateur: true,
    });

    return ok([currentModule, ...moduleHistory]);
  } catch (e) {
    console.error(e);
    return serverError("Failed to fetch history of module [" + id + "]");
  }
}
