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

export async function getActiveFormateurs({
  start,
  end,
}: {
  start: Date;
  end: Date;
}) {
  return prisma.formateur.findMany({
    include: {
      modules: {
        include: { filiere: true, formateur: true },
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

export async function getAllFormateurs() {
  return prisma.formateur.findMany({
    include: {
      modules: { include: { filiere: true } },
    },
  });
}
export async function getAllFormateursSimple() {
  return prisma.formateur.findMany();
}
const includesOfModule = { formateur: true, filiere: true };

export async function getModulesOfPeriod({
  start,
  end,
}: {
  start: Date;
  end: Date;
}) {
  return prisma.module.findMany({
    where: {
      start: { lte: end },
      end: { gte: start },
    },
    include: includesOfModule,
  });
}

export async function getFormateurOfPeriod({
  start,
  end,
}: {
  start: Date;
  end: Date;
}) {
  return prisma.formateur.findMany({
    include: {
      modules: {
        where: {
          start: { gte: start },
          end: { lte: end },
        },
        include: { filiere: true },
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

export async function fetchFiliere(filiereName: string) {
  return prisma.module.findMany({
    where: { filiere: { nom: filiereName } },
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
) {
  return prisma.module.findMany({
    where: {
      formateur: { mail: formateurId },
      start: { gte: start },
      end: { lte: end },
    },
    include: includesOfModule,
  });
}
