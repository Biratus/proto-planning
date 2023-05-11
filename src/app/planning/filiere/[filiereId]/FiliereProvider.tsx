"use client";

import DiffDates from "@/components/history/DiffDates";
import DiffFormateur from "@/components/history/DiffFormateur";
import { apiVersionDowngrade } from "@/lib/dataAccess";
import {
  deserialize,
  formatFullDate,
  formatFullPrettyDate,
  formatTime,
} from "@/lib/date";
import { Formateur, Module, ModuleHistory, Serialized } from "@/lib/types";
import { parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type FiliereStore = {
  filiereData: Module[];
  displayedFiliereData: Module[];
  historyData: HistoryModification[];
  isVisible: (historyId: number) => boolean | undefined;
  toggleModificationVisibility: (modificationId: number) => void;
  revertBackTo: (historyId: number) => void;
  revertConflicts: (ModuleModification & { modified_datetime: Date })[];
  revertTarget?: ModuleModification;
  downgradeVersion: (historyId: number) => void;
  askConfirm: (historyId: number) => void;
};

type ModalRef = { open?: () => void; close?: () => void };

export type ModuleModification = {
  id: number;
  module_id: number;
  nom: string;
  after: {
    start: Date;
    end: Date;
    formateur?: Formateur | null;
  };
  before: {
    start: Date;
    end: Date;
    formateur?: Formateur | null;
  };
};

export type HistoryModification = {
  date: number;
  modifications: ModuleModification[];
};
export const FiliereContext = createContext<FiliereStore | null>(null);

export default function FiliereProvider({
  filiereData,
  filiereHistory,
  children,
}: {
  filiereData: Serialized<Module>[];
  filiereHistory: Serialized<ModuleHistory>[];
} & PropsWithChildren) {
  const [historyVisiblity, setHistoryVisibility] = useState(
    new Map<number, boolean>()
  );
  const [revertConflicts, setRevertConflicts] = useState<
    (ModuleModification & { modified_datetime: Date })[]
  >([]);

  const [revertTarget, setRevertTarget] = useState<ModuleModification>();
  const conflictRef = useRef<ModalRef>({});
  const confirmRef = useRef<ModalRef>({});

  const router = useRouter();

  const isVisible = useCallback(
    (historyId: number) =>
      historyVisiblity.has(historyId) ? historyVisiblity.get(historyId) : true,
    [historyVisiblity]
  );

  const deserializedFiliereData = useMemo(
    () => filiereData.map((m) => deserialize<Module>(m)),
    [filiereData]
  );

  const history = useMemo(
    () =>
      toMapDateHistory(
        filiereHistory.map((h) => deserialize<ModuleHistory>(h)),
        deserializedFiliereData
      ),
    [deserializedFiliereData, filiereHistory]
  );

  const displayedFiliereData = useMemo(() => {
    const filiereData: Module[] = [];
    for (let mod of deserializedFiliereData) {
      const histories = filiereHistory.filter((h) => h.module_id == mod.id);

      // No modification or all modifications visible
      if (histories.length == 0 || histories.every((h) => isVisible(h.id))) {
        filiereData.push(mod);
        continue;
      }

      // There has been a modification on this module and the visibility has been toggled

      // histories sorted by modification date desc
      const sortedHistories = histories
        .map((h) => deserialize<ModuleHistory>(h))
        .sort(
          (h1, h2) =>
            h2.modified_datetime.getTime() - h1.modified_datetime.getTime()
        );

      // get most recent visible history
      let displayedData = sortedHistories[0];

      for (let history of sortedHistories) {
        if (isVisible(history.id)) break;
        displayedData = history;
      }
      filiereData.push({
        ...displayedData,
        id: displayedData.module_id,
      });
    }

    return filiereData;
  }, [deserializedFiliereData, filiereHistory, history, isVisible]);

  const toggleModificationVisibility = useCallback(
    (modificationId: number) => {
      historyVisiblity.set(
        modificationId,
        historyVisiblity.has(modificationId)
          ? !historyVisiblity.get(modificationId)
          : false
      );
      setHistoryVisibility(new Map(historyVisiblity));
    },
    [historyVisiblity]
  );

  const revertBackTo = useCallback(
    async (historyId: number) => {
      const serTargetHistory = filiereHistory.find((h) => h.id == historyId);
      if (!serTargetHistory) {
        console.error("History id:[" + historyId + "] does not exist");
        return;
      }

      const targetHistory = deserialize<ModuleHistory>(serTargetHistory);
      //Check modification is most recent on the module
      const revertConflicts = filiereHistory.filter(
        (h) =>
          h.module_id == targetHistory.module_id &&
          h.id != targetHistory.id &&
          parseISO(h.modified_datetime).getTime() >
            targetHistory.modified_datetime.getTime()
      );

      const currentData = deserializedFiliereData.find(
        (d) => d.id == targetHistory.module_id
      )!;
      if (revertConflicts.length > 0) {
        const sortedConflicts = revertConflicts
          .map((h) => deserialize<ModuleHistory>(h))
          .sort(
            (h1, h2) =>
              h1.modified_datetime.getTime() - h2.modified_datetime.getTime()
          );

        const modifications: (ModuleModification & {
          modified_datetime: Date;
        })[] = [];
        let after = currentData;

        for (let c of sortedConflicts) {
          modifications.push({
            id: c.id,
            nom: c.nom,
            module_id: c.module_id,
            after,
            before: { ...c },
            modified_datetime: c.modified_datetime,
          });
          after = c;
        }
        modifications.push({
          id: targetHistory.id,
          nom: targetHistory.nom,
          module_id: targetHistory.module_id,
          after,
          before: { ...targetHistory },
          modified_datetime: targetHistory.modified_datetime,
        });
        setRevertConflicts(modifications);
        conflictRef.current!.open!();
      } else {
        askConfirm(historyId);
      }
    },
    [filiereHistory]
  );

  const askConfirm = useCallback((historyId: number) => {
    const serTargetHistory = filiereHistory.find((h) => h.id == historyId);
    if (!serTargetHistory) {
      console.error("History id:[" + historyId + "] does not exist");
      return;
    }
    const targetHistory = deserialize<ModuleHistory>(serTargetHistory);
    const currentData = deserializedFiliereData.find(
      (d) => d.id == targetHistory.module_id
    )!;
    setRevertTarget({
      id: targetHistory.id,
      nom: targetHistory.nom,
      module_id: targetHistory.module_id,
      after: { ...currentData },
      before: { ...targetHistory },
    });
    confirmRef.current!.open!();
  }, []);

  const downgradeVersion = useCallback(async (historyId: number) => {
    const resp = await apiVersionDowngrade(historyId);
    if ("error" in resp) {
      console.error("Trouble downgrading version");
    } else {
      conflictRef.current!.close!();
      confirmRef.current!.close!();
      router.refresh();
    }
  }, []);

  return (
    <FiliereContext.Provider
      value={{
        historyData: history,
        filiereData: deserializedFiliereData,
        displayedFiliereData,
        isVisible,
        toggleModificationVisibility,
        revertBackTo,
        revertConflicts,
        revertTarget,
        downgradeVersion,
        askConfirm,
      }}
    >
      {children}
      <RevertConflictModal modalRef={conflictRef} />
      <ConfirmRevertModal modalRef={confirmRef} />
    </FiliereContext.Provider>
  );
}

export function useFiliereStore() {
  const ctx = useContext(FiliereContext);
  if (!ctx) {
    throw new Error("useFiliereStore must be used within a FiliereProvider");
  }
  return ctx;
}

function RevertConflictModal({ modalRef }: { modalRef: RefObject<ModalRef> }) {
  const { revertConflicts, revertBackTo, askConfirm } = useFiliereStore();
  const toggleRef = useRef<HTMLInputElement>(null);

  modalRef.current!.close = () => {
    toggleRef.current!.checked = false;
  };

  modalRef.current!.open = () => {
    toggleRef.current!.checked = true;
  };

  return (
    <>
      <input
        type="checkbox"
        id="RevertConflictModalId"
        className="modal-toggle"
        ref={toggleRef}
      />
      <label htmlFor="RevertConflictModalId" className="modal cursor-pointer">
        <label className="modal-box relative max-w-fit" htmlFor="">
          <h3 className="text-xl font-bold">Attention !</h3>
          <p className="py-4">
            Vous essayez de revenir à une version d'un module sur lequel il y a
            eu des modifications entre temps:
          </p>
          <ul
            className="steps steps-vertical w-11/12"
            style={{ gridAutoRows: "auto" }}
          >
            {revertConflicts.map((history, i) => (
              <li
                className="step-neutral step"
                data-content={i == revertConflicts.length - 1 ? "●" : "x"}
                key={i}
              >
                <div className="mb-5">
                  <div className="text-left">
                    <span className="italic">
                      Depuis le{" "}
                      {formatFullDate(new Date(history.modified_datetime))} à{" "}
                      {formatTime(new Date(history.modified_datetime))} par
                      Clément Birette
                    </span>
                    <div className="flex flex-col gap-2">
                      <Modification modification={history} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="modal-action">
            <button
              className="btn-success btn"
              onClick={() =>
                askConfirm(revertConflicts[revertConflicts.length - 1].id)
              }
            >
              Continuer
            </button>
            <label className="btn-outline btn" htmlFor="RevertConflictModalId">
              Annuler
            </label>
          </div>
        </label>
      </label>
    </>
  );
}
function Modification({ modification }: { modification: ModuleModification }) {
  return (
    <div className="group flex items-center gap-2">
      <div>
        <div className="font-bold">{modification.nom}</div>
        <div className="pl-3">
          <DiffDates before={modification.before} after={modification.after} />
          <DiffFormateur
            before={modification.before}
            after={modification.after}
          />
        </div>
      </div>
    </div>
  );
}

function toMapDateHistory(history: ModuleHistory[], currentData: Module[]) {
  let map = new Map<number, ModuleHistory[]>();
  let historyMap = new Map<number, ModuleHistory[]>();
  let moduleMap = new Map(currentData.map((m) => [m.id, m]));

  for (let h of history) {
    // group by modified date
    if (!map.has(h.modified_datetime.getTime()))
      map.set(h.modified_datetime.getTime(), []);
    map.get(h.modified_datetime.getTime())!.push(h);

    // group by module_id
    if (!historyMap.has(h.module_id)) historyMap.set(h.module_id, []);
    historyMap.get(h.module_id)!.push(h);
  }

  let historyArr: HistoryModification[] = [];

  // Add previous value
  for (let [datetime, modifications] of map) {
    let h: HistoryModification = {
      date: datetime,
      modifications: [],
    };

    for (let before of modifications) {
      let after = historyMap
        .get(before.module_id)!
        .sort(
          (h1, h2) =>
            h1.modified_datetime.getTime() - h2.modified_datetime.getTime()
        )
        .find(
          (m) =>
            m.modified_datetime.getTime() > before.modified_datetime.getTime()
        );
      h.modifications.push({
        before,
        after: after || moduleMap.get(before.module_id)!,
        ...before,
      });
    }
    historyArr.push(h);
  }
  return historyArr;
}

const dummyRevertTarget: ModuleModification = {
  id: -1,
  module_id: -1,
  nom: "",
  before: { start: new Date(), end: new Date() },
  after: { start: new Date(), end: new Date() },
};
function ConfirmRevertModal({ modalRef }: { modalRef: RefObject<ModalRef> }) {
  const toggleRef = useRef<HTMLInputElement>(null);
  const { downgradeVersion, revertTarget = dummyRevertTarget } =
    useFiliereStore();

  modalRef.current!.close = () => {
    toggleRef.current!.checked = false;
  };

  modalRef.current!.open = () => {
    toggleRef.current!.checked = true;
  };
  return (
    <>
      <input
        type="checkbox"
        id="ConfirmRevertModalId"
        className="modal-toggle"
        ref={toggleRef}
      />
      <label htmlFor="ConfirmRevertModalId" className="modal cursor-pointer">
        <label className="modal-box relative max-w-fit" htmlFor="">
          <h3 className="mb-2 text-xl font-bold">
            Vous êtes sur le point de modifier le module suivant :
          </h3>
          <p className="mb-2 font-bold">{revertTarget.nom}</p>
          <p>Les modifications suivantes seront effectuées :</p>
          <p className="pl-4">
            Du{" "}
            <span className="font-bold">
              {formatFullPrettyDate(revertTarget.before.start)}
            </span>
          </p>
          <p className="pl-4">
            au{" "}
            <span className="font-bold">
              {formatFullPrettyDate(revertTarget.before.end)}
            </span>
          </p>
          <p className="pl-4">
            Animé par{" "}
            <span className="font-bold">
              {revertTarget.before.formateur
                ? `${revertTarget.before.formateur.prenom} ${revertTarget.before.formateur.nom}`
                : "N/A"}
            </span>
          </p>
          <div className="modal-action">
            <button
              className="btn-success btn"
              onClick={() => downgradeVersion(revertTarget.id)}
            >
              Confirmer
            </button>
            <label className="btn-outline btn" htmlFor="ConfirmRevertModalId">
              Annuler
            </label>
          </div>
        </label>
      </label>
    </>
  );
}
