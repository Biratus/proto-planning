import { searchFormateurs } from "@/lib/dataAccess";
import { Formateur, Module } from "@/lib/types";
import cn from "classnames";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
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

  const [filteredFormateurs, setFilteredFormateurs] = useState<Formateur[]>([]);

  useEffect(() => {
    (async () => {
      console.log("fetch formateurs in effect");
      const formateurs = await searchFormateurs({});
      setFilteredFormateurs(
        formateurs.map((f) => ({
          ...f,
          nom: f.nom || "",
          prenom: f.prenom || "",
        }))
      );
    })();
  }, []);

  const [searchProps, setSearchProps] = useState<SearchProps>({});

  const filterFormateurs = useCallback(
    async (evt: ChangeEvent<HTMLInputElement>) => {
      const search = evt.target.value;
      setSearchProps((prev) => ({ ...prev, search }));
    },
    []
  );

  const availableFormateurs = useCallback(
    async (evt: ChangeEvent<HTMLInputElement>) => {
      const newSearchProps = {
        ...searchProps,
        available: evt.target.checked ? moduleInterval : undefined,
      };
      setSearchProps(newSearchProps);
      setFilteredFormateurs(await searchFormateurs(newSearchProps));
    },
    [searchProps, moduleInterval]
  );
  const ableFormateurs = useCallback(
    async (evt: ChangeEvent<HTMLInputElement>) => {
      const newSearchProps = {
        ...searchProps,
        able: evt.target.checked ? forModule : undefined,
      };
      setSearchProps(newSearchProps);
      setFilteredFormateurs(await searchFormateurs(newSearchProps));
    },
    [searchProps, forModule]
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
          {filterSearchFormateurs(filteredFormateurs, searchProps.search).map(
            (f) => (
              <li key={f.mail}>
                <a
                  className={cn({ active: f.mail == formateur.mail })}
                  onClick={() => setFormateur(f)}
                >
                  {f.prenom} {f.nom}
                </a>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

function filterSearchFormateurs(formateurs: Formateur[], search = "") {
  return formateurs.filter(
    (f) =>
      f.nom.toLowerCase().includes(search.toLowerCase()) ||
      f.prenom.toLowerCase().includes(search.toLowerCase()) ||
      f.mail.toLowerCase().includes(search.toLowerCase())
  );
}
