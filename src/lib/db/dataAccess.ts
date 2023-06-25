import { Module } from "../types";
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
export async function searchFormateurs(
  {
    search,
    able,
    available,
    alphabetically,
  }: {
    search?: string;
    able?: Module;
    available?: Interval;
    alphabetically?: boolean;
  },
  { page, count }: { page?: number; count?: number }
) {
  let where = {};
  let pagination = {};
  if (search) {
    where = {
      ...where,
      OR: [
        { nom: { contains: search } },
        { prenom: { contains: search } },
        { mail: { contains: search } },
      ],
    };
  }
  // TODO
  /*if(able) {
    where = {
      ...where,

    }
  }*/
  if (available) {
    where = {
      ...where,
      modules: {
        none: {
          end: { gte: available.start },
          start: { lte: available.end },
        },
      },
    };
  }

  if (page !== undefined && count !== undefined) {
    pagination = {
      skip: (page - 1) * count,
      take: count,
    };
  }
  return prisma.formateur.findMany({
    where,
    orderBy: alphabetically
      ? {
          nom: "asc",
        }
      : {},
    ...pagination,
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
