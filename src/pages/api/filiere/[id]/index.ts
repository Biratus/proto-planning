import { prisma } from "@/lib/db/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { isGet, notFound, ok } from "../../../../lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (isGet(req)) {
    const filiere = await prisma.filiere.findUnique({
      where: { nom: req.query.id as string },
      include: { modules: true },
    });
    if (filiere) return ok(res, filiere);
    else return notFound(res, "Filiere");
  }
  return notFound(res, "URL NOT Mapped");
}
