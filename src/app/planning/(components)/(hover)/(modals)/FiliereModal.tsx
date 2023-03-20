"use client";
import CommonModal, { ModalRef } from "@/components/CommonModal";
import { formatFullDate, mapISO, nbOfDaysBetween } from "@/lib/date";
import { fetchFiliere, getOverlapModules, sortModules } from "@/lib/realData";
import { Module } from "@/lib/types";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { AlertTriangle, Download, Info, User } from "react-feather";
import { useFocusedFiliere } from "../../(calendar)/CalendarProvider";

export const FiliereDetailModalId = "filiereDetailModalId";

type DateBounds = {
  start: Date;
  end: Date;
  nbDays: number;
};
const defaultDatebounds: DateBounds = {
  start: new Date(),
  end: new Date(),
  nbDays: 0,
};

export default function FiliereModal() {
  const nom = useFocusedFiliere();
  const modules = useMemo(
    () => sortModules(mapISO<Module>(fetchFiliere(nom), ["start", "end"])),
    [nom]
  );

  const modalRef = useRef<ModalRef>({});

  const dateBounds: DateBounds = useMemo(
    () =>
      modules.length == 0
        ? defaultDatebounds
        : {
            start: modules[0].start,
            end: modules[modules.length - 1].end,
            nbDays: nbOfDaysBetween(
              modules[0].start,
              modules[modules.length - 1].end
            ),
          },
    [modules]
  );

  const stagiaires = [
    "Monique Pinto",
    "Martin Clerc",
    "Vincent Jacob",
    "Franck Evrard",
    "Michelle Michel",
    "Suzanne Benard",
    "Véronique Rolland",
    "Franck Jacques",
    "Claudine Gaudin",
    "Célina Lacombe",
  ];

  const overlappingModules = useMemo(
    () => getOverlapModules(modules),
    [modules]
  );

  return (
    <CommonModal inputId={FiliereDetailModalId} modalRef={modalRef}>
      {/* Info basiques */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-2xl font-bold">{nom}</span>
        <Link
          href={`/planning/filiere/${nom}`}
          className="btn-ghost btn-xs btn-circle btn"
          prefetch={false}
        >
          <Info color="blue" size="1.2em" />
        </Link>
      </div>
      <div className="flex flex-row items-center justify-between">
        <span>
          Du{" "}
          <span className="font-bold">{formatFullDate(dateBounds.start)}</span>{" "}
          au <span className="font-bold">{formatFullDate(dateBounds.end)}</span>{" "}
          - {dateBounds.nbDays} jours
        </span>
        <button className="btn-ghost btn">
          <Link
            href={`/api/filiere/${nom}/pdf`}
            className="flex items-center gap-2"
          >
            <Download />
            Planning
          </Link>
        </button>
      </div>
      {/* Modules superposés */}
      {overlappingModules.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <span className="flex flex-row gap-3 text-lg font-bold underline">
            <AlertTriangle color="red" /> Modules superposés
          </span>
          {overlappingModules.map((overlap, i) => (
            <div
              key={i}
              className="collapse-arrow collapse rounded-xl border border-base-300"
            >
              <input type="checkbox" className="peer" />
              <div className="collapse-title text-lg font-bold peer-checked:border peer-checked:border-b peer-checked:border-base-300">
                Du {formatFullDate(overlap.start)} au{" "}
                {formatFullDate(overlap.end)} (
                {overlap.overlappedModules.length} modules)
              </div>
              <div className="collapse-content">
                <div className="flex flex-col gap-2 p-5">
                  {overlap.overlappedModules.map((mod) => (
                    <div key={mod.id}>
                      Du{" "}
                      <span className="font-bold">
                        {formatFullDate(mod.start)}
                      </span>{" "}
                      au{" "}
                      <span className="font-bold">
                        {formatFullDate(mod.end)}
                      </span>
                      : {mod.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Stagiaires */}
      <div className="collapse-plus collapse mt-4 rounded-xl border border-base-300">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-lg font-bold peer-checked:border peer-checked:border-b peer-checked:border-base-300">
          Stagiaires
        </div>
        <div className="collapse-content">
          <div className="flex flex-col justify-start gap-2 p-5">
            {stagiaires.map((stagiaire) => (
              <div key={stagiaire} className="flex items-center ">
                <User className="mr-2" />
                {stagiaire}
              </div>
            ))}
          </div>
        </div>
      </div>
    </CommonModal>
  );
}
