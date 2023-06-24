import { ok } from "@/lib/api";
import { searchFormateurs } from "@/lib/db/dataAccess";
import { parseISO } from "date-fns";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") as string | undefined;
  let availableFrom = searchParams.has("availableFrom")
    ? parseISO(searchParams.get("availableFrom") as string)
    : null;
  let availableTo = searchParams.has("availableTo")
    ? parseISO(searchParams.get("availableTo") as string)
    : null;
  let available =
    availableFrom && availableTo
      ? { start: availableFrom, end: availableTo }
      : undefined;
  // do something
  const formateurs = await searchFormateurs({ search, available });
  return ok(formateurs);
}
