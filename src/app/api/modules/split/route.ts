import { badRequest, isValidModule, ok, serverError } from "@/lib/api";
import { deserialize } from "@/lib/date";
import { splitModule } from "@/lib/db/ModuleRepository";
import { Module, SerializedModule } from "@/lib/types";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!(body instanceof Array)) {
    return badRequest("Invalid body");
  }

  const modules: SerializedModule[] = body as SerializedModule[];
  if (modules.some((m) => !isValidModule(m))) {
    return badRequest("Invalid dates");
  }
  try {
    const dbResp = await splitModule(
      modules.map((m) => deserialize<Module>(m))
    );
    return ok(dbResp);
  } catch (e) {
    console.error(e);
    return serverError("Scindage module");
  }
}
