import { apiHistoryModules, apiVersionDowngrade } from "@/lib/dataAccess";
import { formatFullDate, formatFullPrettyDate, mapISO } from "@/lib/date";
import { Formateur, Module } from "@/lib/types";
import cn from "classnames";
import { isSameDay } from "date-fns";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { RotateCcw } from "react-feather";

export default function History({ refreshData }: { refreshData: () => void }) {
  const [pagination, setPagination] = useState({ page: 1, count: 20 });

  const [history, setHistory] = useState<Module[][]>([]);

  const [selectedHistory, setSelectedHistory] = useState<Module[]>([]);

  useEffect(() => {
    async function fetchHistory({
      page,
      count,
    }: {
      page: number;
      count: number;
    }) {
      setHistory(
        (await apiHistoryModules(page, count)).map((histo) =>
          mapISO<Module>(histo, ["start", "end"])
        )
      );
    }
    fetchHistory(pagination);
  }, [pagination]);

  const nextPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const prevPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
  }, []);

  const setCount = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) =>
      setPagination((prev) => ({ ...prev, count: parseInt(evt.target.value) })),
    []
  );

  const revertBackTo = useCallback(async (id: number) => {
    const resp = await apiVersionDowngrade(id);

    if ("error" in resp) {
      console.error(resp);
    } else refreshData();
  }, []);

  return (
    <>
      <label htmlFor="history-modal" className="btn">
        Historique
      </label>

      <input type="checkbox" id="history-modal" className="modal-toggle" />
      <label htmlFor="history-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">
            Historique des modifications du planning
          </h3>
          <div className="flex flex-col gap-3">
            {history.map((h, i) => (
              <HistoryItem
                key={i}
                moduleHistory={h}
                onClick={() => setSelectedHistory(h)}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-center gap-2">
            <div className="btn-group">
              <button className="btn btn-sm" onClick={prevPage}>
                «
              </button>
              <button className="btn btn-sm">{pagination.page}</button>
              <button className="btn btn-sm" onClick={nextPage}>
                »
              </button>
            </div>
            <select
              className="select-bordered select select-sm"
              onChange={setCount}
              value={pagination.count}
            >
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
              <option value={50}>50</option>
            </select>
          </div>
        </label>
      </label>
      <input type="checkbox" id="focusedHistory" className="modal-toggle" />
      <SingleHistoryModal
        moduleHistory={selectedHistory}
        revertBackTo={revertBackTo}
      />
    </>
  );
}

function HistoryItem({
  moduleHistory,
  onClick,
}: {
  moduleHistory: Module[];
  onClick: () => void;
}) {
  return (
    <label htmlFor="focusedHistory" className="btn" onClick={onClick}>
      {moduleHistory[0].nom}
    </label>
  );
}

function SingleHistoryModal({
  moduleHistory,
  revertBackTo,
}: {
  moduleHistory: Module[];
  revertBackTo: (id: number) => void;
}) {
  const [original, ...history] = moduleHistory;

  if (!moduleHistory.length) return null;

  return (
    <div className="modal">
      <div className="modal-box relative">
        <label
          htmlFor="focusedHistory"
          className="btn btn-ghost btn-sm absolute right-2 top-2"
        >
          &larr;
        </label>
        <h3 className="text-lg font-bold">Historique de {original.nom}</h3>
        <ul className="steps steps-vertical w-full">
          <li className="step-neutral step" data-content="●">
            <div className="text-left">
              <DateDisplay {...moduleHistory[0]} />
              <FormateurDisplay formateur={moduleHistory[0].formateur} />
            </div>
          </li>
          {history.map((h, i) => (
            <ModuleHistory
              key={i}
              original={i == 0 ? original : history[i - 1]}
              current={h}
              revertBack={() => revertBackTo(h.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function DateDisplay({ start, end }: { start: Date; end: Date }) {
  return (
    <div>
      Du <span className="font-bold">{formatFullDate(start)}</span> au{" "}
      <span className="font-bold">{formatFullDate(end)}</span>
    </div>
  );
}

function FormateurDisplay({ formateur }: { formateur?: Formateur | null }) {
  return (
    <div>
      Animé par:{" "}
      <span className="font-bold">
        {formateur ? `${formateur.prenom} ${formateur.nom}` : "N/A"}
      </span>
    </div>
  );
}
function ModuleHistory({
  original,
  current,
  revertBack,
}: {
  original: Module;
  current: Module;
  revertBack: () => void;
}) {
  const diffDates =
    !isSameDay(original.start, current.start) ||
    !isSameDay(original.end, current.end);

  const diffFormateur =
    (original.formateur && !current.formateur) ||
    (!original.formateur && current.formateur) ||
    original.formateur?.mail != current.formateur?.mail;
  return (
    <li className="group step-neutral step" data-content="">
      <div className="relative w-full">
        <div className="text-left">
          <div
            className={cn({
              "opacity-0 transition-opacity duration-500 group-hover:opacity-100":
                !diffDates,
              "font-bold": diffDates,
            })}
          >
            <DateDisplay {...current} />
          </div>
          <div
            className={cn({
              "opacity-0 transition-opacity duration-500 group-hover:opacity-100":
                !diffFormateur,
              "font-bold": diffFormateur,
            })}
          >
            {current.formateur
              ? `${current.formateur.prenom} ${current.formateur.nom}`
              : "N/A"}
          </div>
        </div>
        <button
          title="Revenir à cette version"
          className={`btn btn-ghost absolute right-0 top-0 h-full`}
          onClick={revertBack}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </li>
  );
}
function DiffFormateur({
  original,
  current,
}: {
  original: Module;
  current: Module;
}) {
  const originalText = original.formateur
    ? `${original.formateur.nom} ${original.formateur.prenom}`
    : "N/A";
  const currentText = current.formateur
    ? `${current.formateur.nom} ${current.formateur.prenom}`
    : "N/A";
  return (
    <div>
      {originalText} &rarr; {currentText}
    </div>
  );
}

function DiffDates({
  original,
  current,
}: {
  original: Module;
  current: Module;
}) {
  return (
    <div>
      <div>
        {formatFullPrettyDate(original.start)} &rarr;{" "}
        {formatFullPrettyDate(original.end)}
      </div>
      <div className="font-bold">
        {formatFullPrettyDate(current.start)} &rarr;{" "}
        {formatFullPrettyDate(current.end)}
      </div>
    </div>
  );
}
