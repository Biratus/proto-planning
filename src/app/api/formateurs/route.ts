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

  let alphabetically = searchParams.has("alphabetically")
    ? searchParams.get("alphabetically") === "true"
    : false;

  let availableTo = searchParams.has("availableTo")
    ? parseISO(searchParams.get("availableTo") as string)
    : null;

  let available =
    availableFrom && availableTo
      ? { start: availableFrom, end: availableTo }
      : undefined;

  const pageStr = searchParams.get("page");
  const countStr = searchParams.get("count");
  let page;
  let count;
  if (pageStr && !isNaN(parseInt(pageStr as string)))
    page = parseInt(pageStr as string);
  if (countStr && !isNaN(parseInt(countStr as string)))
    count = parseInt(countStr as string);

  const formateurs = await searchFormateurs(
    {
      search,
      available,
      alphabetically,
    },
    { page, count }
  );
  return ok(formateurs);
}
