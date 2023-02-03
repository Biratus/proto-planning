"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import {
  LocalStorageState,
  useLocalStorageAfterHydration,
} from "../../hooks/localStorageStore";
import AfterHydration from "../AfterHydration";
type StorageKeyProps = {
  zoomKey: string;
};
type StorageKeyObject = {
  key: string;
};

export const ZoomContext = createContext<StorageKeyObject>({ key: "" });

export default function ZoomProvider({
  zoomKey,
  children,
}: PropsWithChildren & StorageKeyProps) {
  return (
    <ZoomContext.Provider value={{ key: zoomKey }}>
      <AfterHydration>{children}</AfterHydration>
    </ZoomContext.Provider>
  );
}

export function useZoom(
  selector?: (s: LocalStorageState<number>) => any,
  compare?: any
) {
  const ctx = useContext(ZoomContext);
  if (ctx === undefined) {
    throw new Error("useZoom must be used within a ZoomProvider");
  }
  return useLocalStorageAfterHydration(ctx.key)(selector, compare);
}
