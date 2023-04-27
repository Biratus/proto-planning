import { prisma } from "./prisma";

export async function getModuleHistory(page = 1, recordPerPage = 20) {
  return prisma.module_audit.findMany({
    skip: recordPerPage * (page - 1),
    take: recordPerPage,
  });
}

export async function getModuleHistoryOfFiliere(
  filiereName: string,
  page = 1,
  recordPerPage = 20
) {
  return prisma.module_audit.findMany({
    where: {
      filiere_nom: filiereName,
    },
    skip: recordPerPage * (page - 1),
    take: recordPerPage,
  });
}
