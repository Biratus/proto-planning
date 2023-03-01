"use client";

import { filterFormateur } from "@/lib/realData";
import { Formateur, Module } from "@/lib/types";
import cn from "classnames";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { User } from "react-feather";
import { Interval } from "../../packages/calendar/types";

type SearchProps = {
  search?: string;
  available?: Interval;
  able?: Module;
};

export default function FormateurSelect({
  formateur,
  forModule,
  setFormateur,
}: {
  formateur: Formateur;
  forModule?: Module;
  setFormateur: (f: Formateur) => void;
}) {
  const moduleInterval = useMemo<Interval | undefined>(
    () =>
      forModule ? { start: forModule.start, end: forModule.end } : undefined,
    [forModule]
  );

  const [searchProps, setSearchProps] = useState<SearchProps>({});

  const filterFormateurs = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setSearchProps((prev) => ({ ...prev, search: evt.target.value }));
  }, []);

  const availableFormateurs = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setSearchProps((prev) => ({
        ...prev,
        available: evt.target.checked ? moduleInterval : undefined,
      }));
    },
    [moduleInterval]
  );
  const ableFormateurs = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setSearchProps((prev) => ({
        ...prev,
        able: evt.target.checked ? forModule : undefined,
      }));
    },
    [forModule]
  );

  return (
    <div className="dropdown">
      <label className="btn" tabIndex={0}>
        {formateur.prenom} {formateur.nom} <User className="ml-1" />
      </label>
      <div
        className="dropdown-content rounded-box mt-1 w-auto border border-base-300 bg-base-100 p-5 shadow"
        tabIndex={0}
      >
        {/* Disponible */}
        <label className="label cursor-pointer">
          <span className="label-text">Formateurs disponibles</span>
          <input
            type="checkbox"
            className="toggle-success toggle"
            onChange={availableFormateurs}
            checked={searchProps.available !== undefined}
          />
        </label>
        {/* Compétents */}
        <label className="label mb-1 cursor-pointer">
          <span className="label-text">Formateurs compétents</span>
          <input
            type="checkbox"
            className="toggle-success toggle"
            onChange={ableFormateurs}
            checked={searchProps.able !== undefined}
          />
        </label>
        {/* Recherche */}
        <input
          type="text"
          placeholder="Rechercher"
          className="input-bordered input input-sm"
          onChange={filterFormateurs}
        />
        <ul className="menu mt-2 h-80 flex-nowrap overflow-y-scroll bg-base-100">
          {filterFormateur(searchProps).map((f) => (
            <li key={f.mail}>
              <a
                className={cn({ active: f.mail == formateur.mail })}
                onClick={() => setFormateur(f)}
              >
                {f.prenom} {f.nom}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
