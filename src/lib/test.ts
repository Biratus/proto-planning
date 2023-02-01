import { addDays } from "date-fns";
import { mergeModule } from "./calendar";
import { ModuleEvent } from "./types";

const rawModules = [
  {
    id: "1",
    name: "JAVA AVANCEE",
    start: new Date(2023, 1, 3),
    end: new Date(2023, 1, 9),
  },
  {
    id: "2",
    name: "JAVA AVANCEE Superposé",
    start: new Date(2023, 1, 5),
    end: new Date(2023, 1, 10),
  },
];

const excpectedEvent = {
  overlap: true,
  start: new Date(2023, 1, 3),
  end: new Date(2023, 1, 10),
  overlappedModules: [
    {
      id: "1",
    },
    {
      id: "2",
    },
  ],
};
export function mergeModuleTest() {
  let [m1, m2] = rawModules;

  let newEvent = mergeModule(m1 as ModuleEvent, m2 as ModuleEvent);

  console.assert(newEvent.overlap == excpectedEvent.overlap, "Overlap");
  console.assert(
    newEvent.overlappedModules &&
      newEvent.overlappedModules.length ==
        excpectedEvent.overlappedModules.length,
    "overlappedModules length"
  );
  console.assert(newEvent.start == m1.start, "Start");
  console.assert(
    newEvent.end == m2.end,
    `End: excpected ${m2.end} but got ${newEvent.end}`
  );
  let mappedId = newEvent.overlappedModules!.map((m) => m.id);
  for (let mod of excpectedEvent.overlappedModules) {
    console.assert(mappedId.includes(mod.id), `id ${mod.id}`);
  }
}

export function doubleMergeModuleTest() {
  let [m1, m2] = rawModules;

  let m3 = { ...m2, id: "3" };
  m3.end = addDays(m2.end, 5);

  let newEvent = mergeModule(m1 as ModuleEvent, m2 as ModuleEvent);
  newEvent = mergeModule(newEvent, m3 as ModuleEvent);

  let excpected = { ...excpectedEvent };
  excpected.overlappedModules.push(m3);

  console.assert(newEvent.overlap == excpected.overlap, "Overlap");
  console.assert(
    newEvent.overlappedModules &&
      newEvent.overlappedModules.length == excpected.overlappedModules.length,
    "overlappedModules length"
  );

  console.assert(newEvent.start == m1.start, "Start");
  console.assert(newEvent.end == m3.end, "End");

  let mappedId = newEvent.overlappedModules!.map((m) => m.id);
  for (let mod of excpected.overlappedModules) {
    console.assert(mappedId.includes(mod.id), `id ${mod.id}`);
  }
}
