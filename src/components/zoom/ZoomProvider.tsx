"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import { useSpecialStore } from "../../hooks/localStorageStore";
import AfterHydration from "../AfterHydration";
type ZoomContext = {
  value: number;
  setValue: (nv: number) => void;
};

const ZoomContext = createContext<string | null>(null);

export default function ZoomProvider({
  zoomKey,
  children,
}: PropsWithChildren & { zoomKey: string }) {
  return (
    <ZoomContext.Provider value={zoomKey}>
      <AfterHydration>{children}</AfterHydration>
    </ZoomContext.Provider>
  );
}

export const useZoom = () => {
  let ctx = useContext(ZoomContext);
  if (!ctx) throw new Error("useZoom must be used within a ZoomProvider");
  let store = useSpecialStore(ctx);
  return { zoom: store.value, setZoom: store.setValue };
};
