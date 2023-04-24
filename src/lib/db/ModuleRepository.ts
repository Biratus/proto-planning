import { module } from "@prisma/client";
import { Module } from "../types";
import { prisma } from "./prisma";

const includesOfModule = { formateur: true, filiere: true };
export async function getModulesOfPeriod({
  start,
  end,
}: {
  start: Date;
  end: Date;
}): Promise<Module[]> {
  return prisma.module.findMany({
    where: {
      start: { lte: end },
      end: { gte: start },
    },
    include: includesOfModule,
  });
}

export async function getModulesOfFormateur(
  formateurId: string,
  {
    start,
    end,
  }: {
    start: Date;
    end: Date;
  }
): Promise<Module[]> {
  return prisma.module.findMany({
    where: {
      formateur: { mail: formateurId },
      start: { gte: start },
      end: { lte: end },
    },
    include: includesOfModule,
  });
}
export async function getModulesOfFiliere(
  filiereName: string
): Promise<Module[]> {
  return prisma.module.findMany({
    where: { filiere: { nom: filiereName } },
    include: includesOfModule,
  });
}

export async function createModule(module: Module) {
  let { start, end, nom, filiere, formateur, theme } = module;
  return prisma.module.create({
    data: {
      start,
      end,
      nom,
      theme,
      filiere: { connect: filiere },
      formateur: formateur ? { connect: formateur } : undefined,
      id: undefined,
    },
  });
}
export async function updateModule(module: Module) {
  let { start, end, nom, filiere, id, formateur, theme } = module;
  const currModule = await prisma.module.findUnique({ where: { id: id } });

  if (!currModule) throw new Error("Pas de module avec id[" + id + "]");

  const update = prisma.module.update({
    where: { id },
    data: {
      start,
      end,
      nom,
      theme,
      filiere: { connect: filiere },
      formateur: formateur ? { connect: formateur } : undefined,
    },
  });

  return prisma.$transaction([update, auditModule(currModule)]);
}

function auditModule(module: module) {
  let { start, end, nom, filiere_nom, id, formateur_mail, theme } = module;

  return prisma.module_audit.create({
    data: {
      module_id: id,
      start,
      end,
      nom,
      theme,
      action_type: "UPDATE",
      filiere_nom,
      formateur_mail,
    },
  });
}
