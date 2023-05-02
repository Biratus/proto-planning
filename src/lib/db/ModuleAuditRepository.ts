import { formateur, module_audit } from "@prisma/client";
import { prisma } from "./prisma";
export type SimpleHistory = {
  module_id: number;
  nom: string;
  filiere_nom: string;
  modified_datetime: Date;
  count: string;
};
export async function getModulesHistory(page = 1, recordPerPage = 20) {
  const pageNb = recordPerPage * (page - 1);
  const data = await prisma.$queryRaw<
    SimpleHistory[]
  >`SELECT m.module_id, m.nom,m.filiere_nom, ma.max_modified_datetime as modified_datetime, ma.count as count
  FROM module_audit as m
  INNER JOIN (
    SELECT module_id, MAX(modified_datetime) AS max_modified_datetime,count(*) as count
    FROM module_audit
    GROUP BY module_id
  ) as ma ON m.module_id = ma.module_id
  where m.modified_datetime = ma.max_modified_datetime
  order by ma.max_modified_datetime
  LIMIT ${recordPerPage}
  OFFSET ${pageNb}
`;
  return data.map((d) => ({ ...d, count: d.count.toString() }));
}

export async function getModuleHistory(module_id: number) {
  const data = await prisma.$queryRaw<
    (module_audit & { form_nom: string; form_prenom: string })[]
  >`SELECT id, module_id, module_audit.nom as nom, start, end, theme, filiere_nom, formateur_mail, modified_datetime, action_type, modified_by, 
  formateur.nom as form_nom, formateur.prenom as form_prenom
  FROM module_audit
  LEFT JOIN formateur
  ON module_audit.formateur_mail = formateur.mail
  WHERE module_audit.module_id = ${module_id}
  ORDER BY module_audit.modified_datetime DESC`;

  return data.map((d) => {
    const {
      formateur_mail: mail,
      form_nom: formNom,
      form_prenom: formPrenom,
    } = d;
    const {
      id,
      module_id,
      nom,
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
      nom,
      theme,
      filiere_nom,
      formateur_mail,
      modified_datetime,
      action_type,
      modified_by,
      formateur: { mail, nom: formNom, prenom: formPrenom },
    };
  });
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
