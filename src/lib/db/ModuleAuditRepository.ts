import { formateur, module_audit } from "@prisma/client";
import { prisma } from "./prisma";

export async function getModuleHistory(page = 1, recordPerPage = 20) {
  const pageNb = recordPerPage * (page - 1);
  const data = await prisma.$queryRaw<(module_audit & formateur)[]>`SELECT *
  FROM module_audit
  LEFT JOIN formateur
  ON module_audit.formateur_mail = formateur.mail
  ORDER BY module_audit.modified_datetime DESC
  LIMIT ${recordPerPage}
  OFFSET ${pageNb}
`;
  return data.map((d) => {
    const { formateur_mail: mail, nom, prenom } = d;
    const {
      id,
      module_id,
      start,
      end,
      theme,
      filiere_nom,
      formateur_mail,
      modified_datetime,
      action_type,
      modified_by,
    } = d;

    return {
      id,
      module_id,
      start,
      end,
      theme,
      filiere_nom,
      formateur_mail,
      modified_datetime,
      action_type,
      modified_by,
      formateur: { mail, nom, prenom },
    };
  }) as (module_audit & { formateur: formateur })[];
}

export async function getModuleHistoryOfFiliere(filiereName: string) {
  const data = await prisma.$queryRaw<
    (module_audit & { formateur: formateur })[]
  >`SELECT *
  FROM module_audit
  LEFT JOIN formateur
  ON module_audit.formateur_mail = formateur.mail
  WHERE module_audit.filiere_nom = ${filiereName}
  ORDER BY module_audit.modified_datetime DESC`;
  console.log({ data });
  return data;
}
