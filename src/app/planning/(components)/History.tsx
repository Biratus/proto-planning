import {
  apiHistoryModule,
  apiHistoryModules,
  apiVersionDowngrade,
} from "@/lib/dataAccess";
import { formatFullDate, formatFullPrettyDate, formatTime } from "@/lib/date";
import { SimpleHistory } from "@/lib/db/ModuleAuditRepository";
import { Formateur, ModuleHistory } from "@/lib/types";
import cn from "classnames";
import { isSameDay } from "date-fns";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { RotateCcw } from "react-feather";

export default function History({ refreshData }: { refreshData: () => void }) {
  const [pagination, setPagination] = useState({ page: 1, count: 20 });

  const [history, setHistory] = useState<SimpleHistory[]>([]);

  const [selectedHistory, setSelectedHistory] = useState<ModuleHistory[]>([]);

  const fetchHistory = useCallback(async () => {
    setHistory(await apiHistoryModules(pagination.page, pagination.count));
  }, [pagination]);

  useEffect(() => {
    fetchHistory();
  }, [pagination]);

  const selectHistory = useCallback(async (simpleHisto: SimpleHistory) => {
    const data = await apiHistoryModule(simpleHisto.module_id);
    setSelectedHistory(data);
  }, []);

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
      alert(JSON.stringify(resp.error));
    } else {
      refreshData();
      setSelectedHistory(resp);
    }
  }, []);

  return (
    <>
      <label htmlFor="history-modal" className="btn">
        Historique
      </label>

      <input type="checkbox" id="history-modal" className="modal-toggle" />
      <label htmlFor="history-modal" className="modal cursor-pointer">
        <label className="modal-box relative max-w-2xl" htmlFor="">
          <div className="flex items-center justify-between">
            <h3 className="mb-2 text-lg font-bold">
              Historique des modifications du planning
            </h3>
            <button className="btn btn-ghost" onClick={fetchHistory}>
              Actualiser
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {history.map((h, i) => (
              <div className="indicator w-full" key={i}>
                <span className="badge-secondary badge indicator-item">
                  {h.count}
                </span>
                <label
                  htmlFor="focusedHistory"
                  className="btn w-full"
                  onClick={() => selectHistory(h)}
                >
                  <span className="truncate">
                    {h.nom} - {h.filiere_nom}
                  </span>
                </label>
              </div>
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

function SingleHistoryModal({
  moduleHistory,
  revertBackTo,
}: {
  moduleHistory: ModuleHistory[];
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
        <ul className="steps steps-vertical w-full space-y-2">
          <li className="step-neutral step" data-content="●">
            <div className="text-left">
              <DateDisplay {...moduleHistory[0]} />
              <FormateurDisplay formateur={moduleHistory[0].formateur} />
              <div className="italic">
                Modifié par Clément Birette le{" "}
                {formatFullDate(moduleHistory[0].modified_datetime)} à{" "}
                {formatTime(moduleHistory[0].modified_datetime)}
              </div>
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
  original: ModuleHistory;
  current: ModuleHistory;
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
          <div className="italic">
            Modifié par Clément Birette le{" "}
            {formatFullDate(current.modified_datetime)} à{" "}
            {formatTime(current.modified_datetime)}
          </div>
        </div>
        <button
          title="Revenir à cette version"
          className={`btn btn-ghost invisible absolute right-0 top-0 h-full group-hover:visible`}
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
  original: ModuleHistory;
  current: ModuleHistory;
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
  original: ModuleHistory;
  current: ModuleHistory;
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
