import { apiHistoryModules, apiVersionDowngrade } from "@/lib/dataAccess";
import { formatFullDate, formatFullPrettyDate, mapISO } from "@/lib/date";
import { Formateur, Module } from "@/lib/types";
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
  console.log("SingleHistoryModal", { moduleHistory });
  const [original, ...history] = moduleHistory;

  if (!original) return null;

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
        <div>
          <span className="underline">Actuellement</span>
          <DateDisplay {...original} />
          <FormateurDisplay formateur={original.formateur} />
        </div>
        <ul className="menu w-full bg-base-100 p-4 text-base-content">
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
    <>
      <div className="relative my-1">
        <div className="grow">
          <div className="text-lg font-bold">{original.nom}</div>
          {diffDates && <DiffDates original={original} current={current} />}
          {diffFormateur && (
            <DiffFormateur original={original} current={current} />
          )}
        </div>
        <button
          className={`btn btn-ghost absolute right-0 top-0 h-full`}
          onClick={revertBack}
        >
          <RotateCcw />
        </button>
      </div>
      <div className="divider"></div>
    </>
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
