import { notFound, ok } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const filiere = await prisma.filiere.findUnique({
    where: { nom: id },
    include: { modules: true },
  });
  if (filiere) return ok(filiere);
  else return notFound("Filiere");
}
