import { Interval } from "@/components/calendar/types";
import {
  areIntervalsOverlapping,
  formatISO,
  isAfter,
  isBefore,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { parse } from "./date";
import { includesIgnoreCase } from "./strings";
import { Formateur, Module, RawModule } from "./types";

/* ----------------------

    FORMATEURS

  ---------------------- */

const rawFormateurs = [
  {
    prenom: "Jamarcus",
    nom: "Beier",
    mail: "Beier_Jamarcus@yahoo.com",
  },
  {
    prenom: "Johan",
    nom: "Wiegand",
    mail: "Wiegand_Johan28@hotmail.com",
  },
  {
    prenom: "Laurie",
    nom: "Leannon",
    mail: "Leannon.Laurie41@gmail.com",
  },
  {
    prenom: "Jaden",
    nom: "Lockman",
    mail: "Lockman_Jaden94@yahoo.com",
  },
  {
    prenom: "Terrill",
    nom: "Roberts",
    mail: "Roberts.Terrill38@yahoo.com",
  },
  {
    prenom: "Misael",
    nom: "Batz",
    mail: "Batz_Misael@yahoo.com",
  },
  {
    prenom: "Ramona",
    nom: "Schaefer",
    mail: "Schaefer_Ramona25@yahoo.com",
  },
  {
    prenom: "Wallace",
    nom: "Wintheiser",
    mail: "Wintheiser88@yahoo.com",
  },
  {
    prenom: "Justine",
    nom: "Dach",
    mail: "Dach37@gmail.com",
  },
  {
    prenom: "Reuben",
    nom: "McLaughlin",
    mail: "McLaughlin_Reuben@hotmail.com",
  },
  {
    nom: "NA",
    prenom: "Na",
    mail: "na@na.na",
  },
];

const formateurMap = new Map<string, Formateur>();
for (let form of rawFormateurs) {
  formateurMap.set(form.mail, form);
}
export const formateurs = formateurMap;
/* ----------------------

    MODULES

  ---------------------- */

const raw: RawModule[] = [
  {
    id: "d97b0e4e-ced0-489d-9b16-2d4e1d517e3a",
    name: "ROLE ET COMPORTEMENT DU CONSULTANT",
    start: "12/8/2022",
    end: "12/8/2022",
    theme: "COMPORTEMENTAL",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Wallace",
      nom: "Wintheiser",
      mail: "Wintheiser88@yahoo.com",
    },
  },
  {
    id: "bebe0097-9419-491c-83d7-27c9f4613b18",
    name: "SAVOIR SE PRESENTER AVEC SES NOUVELLES COMPETENCES METIERS",
    start: "12/9/2022",
    end: "12/9/2022",
    theme: "COMPORTEMENTAL",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Wallace",
      nom: "Wintheiser",
      mail: "Wintheiser88@yahoo.com",
    },
  },
  {
    id: "0e571c82-806d-4748-bcfa-2b9bcd1d689d",
    name: "ALGO AVEC JAVA",
    start: "12/12/2022",
    end: "12/14/2022",
    theme: "JAVA",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Justine",
      nom: "Dach",
      mail: "Dach37@gmail.com",
    },
  },
  {
    id: "0c40263f-d38b-48c7-94e4-ed24ca889d3c",
    name: "JAVA OBJET",
    start: "12/15/2022",
    end: "12/20/2022",
    theme: "JAVA",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Wallace",
      nom: "Wintheiser",
      mail: "Wintheiser88@yahoo.com",
    },
  },
  {
    id: "b06d9731-35d1-44aa-97c5-5525f4759479",
    name: "INIT BDD ET SQL",
    start: "12/21/2022",
    end: "12/23/2022",
    theme: "FONDAMENTAUX ET BASE DE DONNEES",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      nom: "NA",
      prenom: "Na",
      mail: "na@na.na",
    },
  },
  {
    id: "5e9542d6-e79a-4520-80fb-b196dab8f67a",
    name: "UML",
    start: "1/2/2023",
    end: "1/2/2023",
    theme: "FONDAMENTAUX ET BASE DE DONNEES",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      nom: "NA",
      prenom: "Na",
      mail: "na@na.na",
    },
  },
  {
    id: "569cd8ed-16e2-444f-9634-e7aa3d9b8d62",
    name: "JAVA AVANCEE",
    start: "1/3/2023",
    end: "1/9/2023",
    theme: "JAVA",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Reuben",
      nom: "McLaughlin",
      mail: "McLaughlin_Reuben@hotmail.com",
    },
  },
  {
    id: "666",
    name: "JAVA AVANCEE Superp",
    start: "1/5/2023",
    end: "1/7/2023",
    theme: "JAVA",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Reuben",
      nom: "McLaughlin",
      mail: "McLaughlin_Reuben@hotmail.com",
    },
  },
  {
    id: "66432815-2bc6-47bf-b4df-5f24ea5cbe93",
    name: "XML ET JSON",
    start: "1/10/2023",
    end: "1/10/2023",
    theme: "WEB",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Reuben",
      nom: "McLaughlin",
      mail: "McLaughlin_Reuben@hotmail.com",
    },
  },
  {
    id: "06d6de05-f0b5-46ba-b880-f057ef158db9",
    name: "MAVEN ET GIT",
    start: "1/11/2023",
    end: "1/11/2023",
    theme: "METHODES ET OUTILS",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Wallace",
      nom: "Wintheiser",
      mail: "Wintheiser88@yahoo.com",
    },
  },
  {
    id: "6313720b-ce59-4a60-91d9-7082e7252525",
    name: "HTML5, CSS, BOOTSTRAP4",
    start: "1/12/2023",
    end: "1/13/2023",
    theme: "WEB",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Johan",
      nom: "Wiegand",
      mail: "Wiegand_Johan28@hotmail.com",
    },
  },
  {
    id: "790e3b05-b512-4b1f-bd39-ed944b2ea4ef",
    name: "JAVASCRIPT",
    start: "1/16/2023",
    end: "1/18/2023",
    theme: "WEB",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Misael",
      nom: "Batz",
      mail: "Batz_Misael@yahoo.com",
    },
  },
  {
    id: "4ad16ba0-2f20-4394-878c-2d265893edcf",
    name: "SERVLET / JSP",
    start: "1/19/2023",
    end: "1/20/2023",
    theme: "WEB",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Wallace",
      nom: "Wintheiser",
      mail: "Wintheiser88@yahoo.com",
    },
  },
  {
    id: "7d98a5e6-3469-4dd8-a3de-5d73ed05ce57",
    name: "JPA 2 AVEC HIBERNATE",
    start: "1/23/2023",
    end: "1/27/2023",
    theme: "FRAMEWORKS",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Wallace",
      nom: "Wintheiser",
      mail: "Wintheiser88@yahoo.com",
    },
  },
  {
    id: "f30b6fb4-9bf2-404c-a127-ab6ab87c0875",
    name: "SPRING CORE, DATA ET TEST",
    start: "1/30/2023",
    end: "2/1/2023",
    theme: "FRAMEWORKS",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Misael",
      nom: "Batz",
      mail: "Batz_Misael@yahoo.com",
    },
  },
  {
    id: "ec923019-d95a-48e2-b6cd-db5e6b0469c9",
    name: "SPRING MVC",
    start: "2/2/2023",
    end: "2/3/2023",
    theme: "FRAMEWORKS",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Justine",
      nom: "Dach",
      mail: "Dach37@gmail.com",
    },
  },
  {
    id: "34842f84-e21e-42cc-9fb4-c9c556c0be94",
    name: "AGILE SCRUM + SAFE",
    start: "2/6/2023",
    end: "2/9/2023",
    theme: "METHODES ET OUTILS",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Wallace",
      nom: "Wintheiser",
      mail: "Wintheiser88@yahoo.com",
    },
  },
  {
    id: "fad6ecd0-9b3e-4a6b-9375-6773a9c58cf8",
    name: "UNIX",
    start: "2/10/2023",
    end: "2/10/2023",
    theme: "FONDAMENTAUX ET BASE DE DONNEES",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Wallace",
      nom: "Wintheiser",
      mail: "Wintheiser88@yahoo.com",
    },
  },
  {
    id: "2fb0f0ec-f635-4522-88ec-a39b0fadf99a",
    name: "SPRING MVC",
    start: "2/13/2023",
    end: "2/15/2023",
    theme: "FRAMEWORKS",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Terrill",
      nom: "Roberts",
      mail: "Roberts.Terrill38@yahoo.com",
    },
  },
  {
    id: "f5a85d29-2fd1-4069-807e-6b004cc01baa",
    name: "SPRING BOOT, REST ET SECURITY",
    start: "2/16/2023",
    end: "2/17/2023",
    theme: "FRAMEWORKS",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Johan",
      nom: "Wiegand",
      mail: "Wiegand_Johan28@hotmail.com",
    },
  },
  {
    id: "e4cfe1a2-ac82-45bb-9808-0c04dafe37bb",
    name: "ANGULAR",
    start: "2/20/2023",
    end: "2/24/2023",
    theme: "FRAMEWORKS",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Johan",
      nom: "Wiegand",
      mail: "Wiegand_Johan28@hotmail.com",
    },
  },
  {
    id: "7d6fb23f-fdbc-4149-a506-aa55da754f9a",
    name: "PROJET FINAL",
    start: "2/27/2023",
    end: "3/3/2023",
    theme: "PROJET",
    filiere: "I-221208-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Johan",
      nom: "Wiegand",
      mail: "Wiegand_Johan28@hotmail.com",
    },
  },
  {
    id: "524e8c31-a4e0-4345-894f-3be383e97bfe",
    name: "ROLE ET COMPORTEMENT DU CONSULTANT",
    start: "1/19/2023",
    end: "1/19/2023",
    theme: "COMPORTEMENTAL",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Terrill",
      nom: "Roberts",
      mail: "Roberts.Terrill38@yahoo.com",
    },
  },
  {
    id: "36edbbf3-a8bc-455f-819f-6cba1f1a45ac",
    name: "SAVOIR SE PRESENTER AVEC SES NOUVELLES COMPETENCES METIERS",
    start: "1/20/2023",
    end: "1/20/2023",
    theme: "COMPORTEMENTAL",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Jaden",
      nom: "Lockman",
      mail: "Lockman_Jaden94@yahoo.com",
    },
  },
  {
    id: "8399f9a5-9ac0-4179-a31f-9ac8ce44b664",
    name: "ALGO AVEC JAVA",
    start: "1/23/2023",
    end: "1/25/2023",
    theme: "JAVA",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Jaden",
      nom: "Lockman",
      mail: "Lockman_Jaden94@yahoo.com",
    },
  },
  {
    id: "2195e079-2a1c-4758-a08f-6c9dee7420ea",
    name: "JAVA OBJET",
    start: "1/26/2023",
    end: "1/31/2023",
    theme: "JAVA",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Laurie",
      nom: "Leannon",
      mail: "Leannon.Laurie41@gmail.com",
    },
  },
  {
    id: "d0579259-a15b-4330-8103-f75fe032d5ae",
    name: "INIT BDD ET SQL",
    start: "2/1/2023",
    end: "2/3/2023",
    theme: "FONDAMENTAUX ET BASE DE DONNEES",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Wallace",
      nom: "Wintheiser",
      mail: "Wintheiser88@yahoo.com",
    },
  },
  {
    id: "8dd52c79-33ec-4f67-a0dd-8379861e2147",
    name: "UML",
    start: "2/6/2023",
    end: "2/6/2023",
    theme: "FONDAMENTAUX ET BASE DE DONNEES",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Justine",
      nom: "Dach",
      mail: "Dach37@gmail.com",
    },
  },
  {
    id: "89ca737c-5e0c-47d5-a54d-e626d4ffddaf",
    name: "JAVA AVANCEE",
    start: "2/7/2023",
    end: "2/13/2023",
    theme: "JAVA",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Johan",
      nom: "Wiegand",
      mail: "Wiegand_Johan28@hotmail.com",
    },
  },
  {
    id: "51b8818e-7b44-4c99-8167-278721af79ee",
    name: "XML ET JSON",
    start: "2/14/2023",
    end: "2/14/2023",
    theme: "WEB",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Johan",
      nom: "Wiegand",
      mail: "Wiegand_Johan28@hotmail.com",
    },
  },
  {
    id: "3d0b7b4e-1e5f-4281-852c-119e8b7cbaed",
    name: "MAVEN ET GIT",
    start: "2/15/2023",
    end: "2/15/2023",
    theme: "METHODES ET OUTILS",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Ramona",
      nom: "Schaefer",
      mail: "Schaefer_Ramona25@yahoo.com",
    },
  },
  {
    id: "bfa683c7-a8a8-48ca-bc35-bacc10031f35",
    name: "JPA 2 AVEC HIBERNATE",
    start: "2/16/2023",
    end: "2/22/2023",
    theme: "FRAMEWORKS",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Laurie",
      nom: "Leannon",
      mail: "Leannon.Laurie41@gmail.com",
    },
  },
  {
    id: "f822466e-c5c3-4d68-af1e-3fade6e954b4",
    name: "HTML5, CSS, BOOTSTRAP4",
    start: "2/23/2023",
    end: "2/24/2023",
    theme: "WEB",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Misael",
      nom: "Batz",
      mail: "Batz_Misael@yahoo.com",
    },
  },
  {
    id: "4509b15d-1ab9-4227-9f0e-a12653a88dc0",
    name: "JAVASCRIPT",
    start: "2/27/2023",
    end: "3/1/2023",
    theme: "WEB",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Jamarcus",
      nom: "Beier",
      mail: "Beier_Jamarcus@yahoo.com",
    },
  },
  {
    id: "be9d1987-1465-43f3-b676-77b73ef18cec",
    name: "SERVLET / JSP",
    start: "3/2/2023",
    end: "3/3/2023",
    theme: "WEB",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Wallace",
      nom: "Wintheiser",
      mail: "Wintheiser88@yahoo.com",
    },
  },
  {
    id: "70546664-5619-49e0-8e9b-2b8e53574851",
    name: "SPRING CORE, DATA ET TEST",
    start: "3/6/2023",
    end: "3/8/2023",
    theme: "FRAMEWORKS",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Johan",
      nom: "Wiegand",
      mail: "Wiegand_Johan28@hotmail.com",
    },
  },
  {
    id: "ef1e1071-d7a6-49ef-b1e9-f86ffd9d56b0",
    name: "SPRING MVC",
    start: "3/9/2023",
    end: "3/15/2023",
    theme: "FRAMEWORKS",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Reuben",
      nom: "McLaughlin",
      mail: "McLaughlin_Reuben@hotmail.com",
    },
  },
  {
    id: "8158f760-1964-402e-89ce-53f4b506cf56",
    name: "SPRING BOOT, REST ET SECURITY",
    start: "3/16/2023",
    end: "3/17/2023",
    theme: "FRAMEWORKS",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Ramona",
      nom: "Schaefer",
      mail: "Schaefer_Ramona25@yahoo.com",
    },
  },
  {
    id: "9fb3c6df-493a-4bba-8450-5bb66bd06794",
    name: "AGILE SCRUM + SAFE",
    start: "3/20/2023",
    end: "3/23/2023",
    theme: "METHODES ET OUTILS",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Jamarcus",
      nom: "Beier",
      mail: "Beier_Jamarcus@yahoo.com",
    },
  },
  {
    id: "19050a80-68d7-41d1-bc97-fc6851b57a95",
    name: "UNIX",
    start: "3/24/2023",
    end: "3/24/2023",
    theme: "FONDAMENTAUX ET BASE DE DONNEES",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Laurie",
      nom: "Leannon",
      mail: "Leannon.Laurie41@gmail.com",
    },
  },
  {
    id: "fcff45aa-c138-4514-90f9-ee4df059fa8f",
    name: "ANGULAR",
    start: "3/27/2023",
    end: "3/30/2023",
    theme: "FRAMEWORKS",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Wallace",
      nom: "Wintheiser",
      mail: "Wintheiser88@yahoo.com",
    },
  },
  {
    id: "519e9410-094f-428f-ad3d-38f7bb5791be",
    name: "PROJET FINAL",
    start: "4/3/2023",
    end: "4/7/2023",
    theme: "PROJET",
    filiere: "I-230119-DIS-399-SOPRA-JAVA",
    formateur: {
      prenom: "Jaden",
      nom: "Lockman",
      mail: "Lockman_Jaden94@yahoo.com",
    },
  },
];

const parsedModules: RawModule[] = [];

for (let m of raw) {
  parsedModules.push({
    ...m,
    start: formatISO(parse(m.start, "M/d/yyyy")),
    end: formatISO(parse(m.end, "M/d/yyyy")),
  });
}

export const modules: RawModule[] = parsedModules;

const MISSING_FORMATEUR = "na@na.na";

export const isFormateurMissing = (mod: Module | RawModule) => {
  return mod.formateur.mail == MISSING_FORMATEUR;
};

export function filterFormateur({
  search,
  available,
  able,
}: {
  search?: string;
  available?: Interval;
  able?: Module;
}): Formateur[] {
  let filtered = [];
  for (let form of formateurMap.values()) {
    let satisfies = true;
    if (
      search &&
      !includesIgnoreCase(form.nom, search) &&
      !includesIgnoreCase(form.prenom, search)
    )
      satisfies = false;
    // if(available && !formateurAvailable(form,available)) satisfies = false; // Wait for BDD
    // if(able && !formateurAble(form,able)) satisfies = false; // Wait for BDD

    if (satisfies) filtered.push(form);
  }
  return filtered;
}

export function fetchFiliere(filiereId: string) {
  return modules.filter((m) => m.filiere == filiereId);
}

export function getModulesOfFormateur(formateurId: string, interval: Interval) {
  return modules.filter(
    (m) =>
      m.formateur.mail == formateurId &&
      areIntervalsOverlapping(
        { start: parseISO(m.start), end: parseISO(m.end) },
        interval,
        { inclusive: true }
      )
  );
}

export const themes = [
  "COMPORTEMENTAL",
  "JAVA",
  "FONDAMENTAUX ET BASE DE DONNEES",
  "WEB",
  "METHODES ET OUTILS",
  "FRAMEWORKS",
  "PROJET",
];

/*
  --------
    UTILS
  --------
*/

export function getOverlapModules(
  modules: Module[]
): (Interval & { overlappedModules: Module[] })[] {
  let overlappedModules: Module[][] = [];

  for (let mod1 of modules) {
    for (let mod2 of modules) {
      if (mod1.id !== mod2.id && moduleOverlap(mod1, mod2)) {
        if (
          !overlappedModules.some((overlapped) => overlapped.includes(mod1))
        ) {
          overlappedModules.push([mod1, mod2]);
        } else {
          const overlappIndex = overlappedModules.findIndex((overlapped) =>
            overlapped.includes(mod1)
          );
          overlappedModules[overlappIndex].push(mod2);
        }
      }
    }
  }

  return overlappedModules.map((mods) => ({
    start: mods.reduce(
      (acc: Date | null, m) =>
        (acc = acc == null || isBefore(m.start, acc) ? m.start : acc),
      null
    )!,
    end: mods.reduce(
      (acc: Date, m) =>
        (acc = acc == null || isAfter(m.end, acc) ? m.end : acc),
      new Date()
    ),
    overlappedModules: sortModules(mods),
  }));
}

export function moduleOverlap(m1: Module, m2: Module) {
  return isWithinInterval(m1.start, m2) || isWithinInterval(m1.end, m2);
}

export function sortModules(modules: Module[]) {
  return modules.sort((m1, m2) => m1.start.getTime() - m2.start.getTime());
}
