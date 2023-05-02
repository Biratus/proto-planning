import { notFound } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { makePDF } from "../../../../../lib/pdf";
import htmlFromFiliere from "../../../../../pdfMakers/filiereSimple";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let fId = req.query.id as string;
  const filiere = await prisma.filiere.findUnique({
    where: {
      nom: fId,
    },
    include: {
      modules: {
        include: { formateur: true },
      },
    },
  });

  if (!filiere) return notFound(res, "Filière");

  const modules = filiere.modules;
  const [pdfBuffer, finished] = await makePDF(htmlFromFiliere(fId, modules));
  // writeFileSync("table.html", htmlFromFiliere(fId, modules)); // saving the pdf locally - DEBUG PURPOSE /!\
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="Planning_' + fId + '.pdf"'
  );
  res.send(pdfBuffer);

  /**@ts-ignore */
  await finished(); // Important!
}
