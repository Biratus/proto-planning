import { prisma } from "./prisma";
export async function getAllFilieres() {
  return prisma.filiere.findMany({
    include: {
      modules: { include: { formateur: true } },
    },
  });
}

export async function getActiveFilieres({
  start,
  end,
}: {
  start: Date;
  end: Date;
}) {
  return prisma.filiere.findMany({
    include: {
      modules: {
        include: { formateur: true, filiere: true },
      },
    },
    where: {
      modules: {
        some: {
          start: { gte: start },
          end: { lte: end },
        },
      },
    },
  });
}

export async function getFiliereOfPeriod({
  start,
  end,
}: {
  start: Date;
  end: Date;
}) {
  return prisma.filiere.findMany({
    include: {
      modules: {
        where: {
          start: { gte: start },
          end: { lte: end },
        },
        include: { formateur: true },
      },
    },
  });
}
