"use client";
import { useFocusedFiliere } from "@/app/planning/(store)/hoverStore";
import CommonModal, { ModalRef } from "@/components/CommonModal";
import { getOverlapModules } from "@/lib/calendar/calendar";
import { formatFullDate, formatMonthYear, nbOfDaysBetween } from "@/lib/date";
import { startOfMonth } from "date-fns";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { AlertTriangle, Download, Info, User } from "react-feather";

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
  const { nom, modules = [] } = useFocusedFiliere() || { nom: "", modules: [] };

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
            prefetch={false}
          >
            <Download />
            PDF Planning
          </Link>
        </button>
      </div>
      {/* Modules superposés */}
      {overlappingModules.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <span className="flex flex-row items-center gap-3 text-lg font-bold underline">
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
                  <Link
                    href={`/planning/filiere?date=${formatMonthYear(
                      startOfMonth(overlap.overlappedModules[0].start)
                    )}`}
                    className="link"
                    prefetch={false}
                  >
                    Afficher dans le calendrier
                  </Link>
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
                      : {mod.nom}
                      {mod.id}
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
            {stagiaires.map((stagiaire, i) => (
              <div key={i} className="flex items-center ">
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
