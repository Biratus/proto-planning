import { searchFormateurs } from "@/lib/dataAccess";
import { Formateur, Module } from "@/lib/types";
import cn from "classnames";
import {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { User } from "react-feather";
import { Interval } from "../../packages/calendar/types";

type SearchProps = {
  search?: string;
  available?: Interval;
  able?: Module;
};

const countDisplayed = 6;

export default function FormateurSelect({
  formateur,
  forModule,
  // setFormateur,
  formateurRef,
}: {
  formateur?: Formateur;
  forModule?: Module;
  // setFormateur: (f: Formateur) => void;
  formateurRef: MutableRefObject<Formateur | null>;
}) {
  const moduleInterval = useMemo<Interval | undefined>(
    () =>
      forModule ? { start: forModule.start, end: forModule.end } : undefined,
    [forModule]
  );

  const [selectedFormateur, setSelectedFormateur] = useState(formateur);

  const listRef = useRef<HTMLLIElement>(null);
  const [filteredFormateurs, setFilteredFormateurs] = useState<Formateur[]>([]);
  const [nextPageLoading, setNextPageLoading] = useState(false);
  const pageRef = useRef(1);
  const [searchProps, setSearchProps] = useState<SearchProps>({});

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) nextPage();
    });
    observer.observe(listRef.current!);
    return () => {
      if (listRef.current) observer.unobserve(listRef.current);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const formateurs = await pageSearch();
      setFilteredFormateurs(formateurs);
    })();
  }, []);

  const selectFormateur = useCallback((formateur: Formateur) => {
    setSelectedFormateur(formateur);
    formateurRef.current = formateur;
  }, []);

  // Recherche
  const filterFormateurs = useCallback(
    async (evt: ChangeEvent<HTMLInputElement>) => {
      setSearchProps((prev) => ({
        ...prev,
        search: evt.target.value,
      }));
      const formateurs =
        evt.target.value.length == 0
          ? await pageSearch()
          : await searchFormateurs({
              alphabetically: true,
              ...searchProps,
              search: evt.target.value,
            });
      setFilteredFormateurs(formateurs);
    },
    []
  );

  // disponible
  const availableFormateurs = useCallback(
    async (evt: ChangeEvent<HTMLInputElement>) => {
      const newSearchProps = {
        ...searchProps,
        available: evt.target.checked ? moduleInterval : undefined,
      };
      setSearchProps(newSearchProps);
      setFilteredFormateurs(await pageSearch(newSearchProps));
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

  const nextPage = useCallback(async () => {
    setNextPageLoading(true);
    pageRef.current++;
    const formateurs = await pageSearch();

    if (formateurs.length == 0 || formateurs.length < countDisplayed)
      pageRef.current = -1;
    setFilteredFormateurs((prev) => [...prev, ...formateurs]);
    setNextPageLoading(false);
  }, [pageRef]);

  const pageSearch = useCallback(async (extra?: SearchProps) => {
    return searchFormateurs({
      alphabetically: true,
      page: pageRef.current,
      count: countDisplayed,
    });
  }, []);
  return (
    <div className="dropdown">
      <label className="btn" tabIndex={0}>
        {selectedFormateur
          ? `${selectedFormateur.prenom} ${selectedFormateur.nom}`
          : "N/A"}{" "}
        <User className="ml-1" />
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
        <ul className="menu mt-2 h-auto max-h-60 flex-nowrap overflow-y-scroll bg-base-100">
          {filteredFormateurs.map((f) => (
            <li key={f.mail}>
              <a
                className={cn({
                  active: selectedFormateur && f.mail == selectedFormateur.mail,
                })}
                onClick={() => selectFormateur(f)}
              >
                {f.prenom} {f.nom}
              </a>
            </li>
          ))}
          {nextPageLoading && (
            <li>
              <progress className="progress w-full"></progress>
            </li>
          )}
          {pageRef.current > 0 && <li ref={listRef}></li>}
        </ul>
      </div>
    </div>
  );
}
