import { module, module_audit } from "@prisma/client";
import { Module } from "../types";
import { prisma } from "./prisma";

const includesOfModule = { formateur: true, filiere: true };

export async function getModules(ids: number[]) {
  return prisma.module.findMany({
    where: { id: { in: ids } },
    include: includesOfModule,
  });
}

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

// Mise à jour des modules en batch
// On fait une transaction pour chaque module. Si la transaction échoue on casse pas tout: on créer un object avec {error,module}
export async function updateModules(
  modules: Module[]
): Promise<([module, module_audit] | { error: any; module: Module })[]> {
  const transactionUpdates = [];

  for (let mod of modules) {
    const transaction = updateModule(mod).catch((err) => {
      console.error(err);
      return {
        error: err.message,
        module: mod,
      };
    });
    transactionUpdates.push(transaction);
  }

  return Promise.all(transactionUpdates);
}

export async function updateModule(module: Module) {
  const currModule = await getModule(module.id);

  if (!currModule)
    return Promise.reject(
      new Error("Pas de module avec id[" + module.id + "]")
    );

  return prisma.$transaction([
    updateFromModule(module),
    auditModule(currModule),
  ]);
}

function updateFromModule(module: Module) {
  let { start, end, nom, filiere, id, formateur, theme } = module;

  return prisma.module.update({
    where: { id },
    data: {
      start,
      end,
      nom,
      theme,
      filiere: { connect: { nom: filiere.nom } },
      formateur: formateur ? { connect: { mail: formateur.mail } } : undefined,
    },
  });
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

export async function moduleVersionDowngrade(historyId: number) {
  const history = await prisma.module_audit.findUnique({
    where: { id: historyId },
  });

  if (!history) {
    return Promise.reject(new Error("No history with id [" + historyId + "]"));
  }

  const histoyDelete = prisma.module_audit.deleteMany({
    where: {
      module_id: history.module_id,
      modified_datetime: { gte: history.modified_datetime },
    },
  });
  let { start, end, nom, filiere_nom, formateur_mail, theme } = history;

  const moduleUpdate = prisma.module.update({
    where: { id: history.module_id },
    data: {
      start,
      end,
      nom,
      filiere_nom,
      formateur_mail,
      theme,
    },
  });

  return prisma.$transaction([histoyDelete, moduleUpdate]);
}

export async function getModule(
  id: number,
  fetch: { filiere?: boolean; formateur?: boolean } = {
    filiere: false,
    formateur: false,
  }
) {
  return prisma.module.findUnique({
    where: { id },
    include: fetch,
  });
}
