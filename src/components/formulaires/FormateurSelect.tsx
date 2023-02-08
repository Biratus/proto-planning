"use client";

import { filterFormateur } from "@/lib/realData";
import { Formateur, Module } from "@/lib/types";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { User } from "react-feather";
import { Interval } from "../calendar/types";

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

  // const [selected, setSelected] = useState(formateur);
  // console.log("Render FormateurSelect", {
  //   selected: selected.mail,
  //   prop: formateur.mail,
  // });

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

  // const changeFormateur = (f: Formateur) => {
  //   setSelected(f);
  //   onSelect(f);
  // };

  return (
    <div className="dropdown">
      <label className="btn" tabIndex={0}>
        {formateur.prenom} {formateur.nom} <User className="ml-1" />
      </label>
      <div
        className="dropdown-content shadow rounded-box bg-base-100 w-auto mt-1 p-5 border border-base-300"
        tabIndex={0}
      >
        {/* Disponible */}
        <label className="label cursor-pointer">
          <span className="label-text">Formateurs disponibles</span>
          <input
            type="checkbox"
            className="toggle toggle-success"
            onChange={availableFormateurs}
            checked={searchProps.available !== undefined}
          />
        </label>
        {/* Compétents */}
        <label className="label cursor-pointer mb-1">
          <span className="label-text">Formateurs compétents</span>
          <input
            type="checkbox"
            className="toggle toggle-success"
            onChange={ableFormateurs}
            checked={searchProps.able !== undefined}
          />
        </label>
        {/* Recherche     */}
        <input
          type="text"
          placeholder="Rechercher"
          className="input input-sm input-bordered"
          onChange={filterFormateurs}
        />
        <ul className="menu mt-2 h-80 overflow-y-scroll bg-base-100 flex-nowrap">
          {filterFormateur(searchProps).map((f) => (
            <li key={f.mail}>
              <a
                className={`${f.mail == formateur.mail ? "active" : ""}`}
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
