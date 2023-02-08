import { Module } from "@/lib/types";
import { NextApiRequest, NextApiResponse } from "next";
import { mapISO } from "../../../../../lib/date";
import { makePDF } from "../../../../../lib/pdf";
import { fetchFiliere } from "../../../../../lib/realData";
import htmlFromFiliere from "../../../../../pdfMakers/filiereSimple";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let fId = req.query.id as string;
  let modules = mapISO<Module>(fetchFiliere(fId), ["start", "end"]);

  const [pdfBuffer, finished] = await makePDF(htmlFromFiliere(fId, modules));
  // writeFileSync("table.html", tableHTML); // saving the pdf locally - DEBUG PURPOSE /!\
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="Planning_' + fId + '.pdf"'
  );
  res.send(pdfBuffer);

  /**@ts-ignore */
  await finished(); // Important!
}
