"use client";

import { apiVersionDowngrade } from "@/lib/dataAccess";
import { deserialize } from "@/lib/date";
import {
  getDisplayedFiliereData,
  getModificationConflicts,
  HistoryModification,
  makeRevertConflictModification,
  ModuleModification,
  toMapDateHistory,
} from "@/lib/history";
import { Module, ModuleHistory, Serialized } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import ConfirmRevertModal from "./ConfirmRevertModal";
import RevertConflictModal from "./RevertConflictModal";

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

export const FiliereContext = createContext<FiliereStore | null>(null);

export default function FiliereProvider({
  filiereData,
  filiereHistory: originalHistory,
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

  const filiereHistory = useMemo(
    () => originalHistory.map((h) => deserialize<ModuleHistory>(h)),
    [originalHistory]
  );

  const history = useMemo(
    () => toMapDateHistory(filiereHistory, deserializedFiliereData),
    [deserializedFiliereData, filiereHistory]
  );

  const displayedFiliereData = useMemo(
    () =>
      getDisplayedFiliereData(
        deserializedFiliereData,
        filiereHistory,
        isVisible
      ),
    [deserializedFiliereData, filiereHistory, history, isVisible]
  );

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
      const targetHistory = filiereHistory.find((h) => h.id == historyId);
      if (!targetHistory) {
        console.error("History id:[" + historyId + "] does not exist");
        return;
      }

      const currentData = deserializedFiliereData.find(
        (d) => d.id == targetHistory.module_id
      )!;
      //Check modification is most recent on the module
      const revertConflicts = getModificationConflicts(
        targetHistory,
        filiereHistory
      );

      if (revertConflicts.length > 0) {
        const sortedConflicts = revertConflicts.sort(
          (h1, h2) =>
            h1.modified_datetime.getTime() - h2.modified_datetime.getTime()
        );
        setRevertConflicts(
          makeRevertConflictModification(
            targetHistory,
            sortedConflicts,
            currentData
          )
        );
        conflictRef.current!.open!();
      } else {
        askConfirm(historyId);
      }
    },
    [filiereHistory]
  );

  const askConfirm = useCallback((historyId: number) => {
    const targetHistory = filiereHistory.find((h) => h.id == historyId);
    if (!targetHistory) {
      console.error("History id:[" + historyId + "] does not exist");
      return;
    }
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
