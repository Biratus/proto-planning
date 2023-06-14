"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import {
  PlanningStorage,
  usePlanningStore,
} from "../../hooks/localStorageStore";
import AfterHydration from "../AfterHydration";
type ZoomContext = {
  value: number;
  setValue: (nv: number) => void;
};

const ZoomContext = createContext<keyof PlanningStorage | null>(null);

export default function ZoomProvider({
  zoomKey,
  children,
}: PropsWithChildren & { zoomKey: keyof PlanningStorage }) {
  return (
    <ZoomContext.Provider value={zoomKey}>
      <AfterHydration>{children}</AfterHydration>
    </ZoomContext.Provider>
  );
}

export const useZoom = () => {
  let ctx = useContext(ZoomContext);
  if (!ctx) throw new Error("useZoom must be used within a ZoomProvider");
  let store = usePlanningStore(ctx);
  return { zoom: store.value, setZoom: store.setValue };
};
