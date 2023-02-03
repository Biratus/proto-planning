"use client";
import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { create, useStore } from "zustand";

type HoverState = {
  hoverElement: string | null;
  hoverThis: (elt?: string) => void;
};

type HoverStore = ReturnType<typeof createHoverStore>;

const createHoverStore = (elements: string[]) =>
  create<HoverState>((set) => ({
    hoverElement: null,
    hoverThis: (elt?: string) => set({ hoverElement: elt }),
  }));

const HoverContext = createContext<HoverStore | null>(null);

export default function HoverProvider({
  elements,
  children,
}: { elements: string[] } & PropsWithChildren) {
  const hoverStore = useRef<HoverStore>();
  if (!hoverStore.current) {
    hoverStore.current = createHoverStore(elements);
  }
  return (
    <HoverContext.Provider value={hoverStore.current}>
      {children}
    </HoverContext.Provider>
  );
}

type HoverHook = {
  hover: Boolean;
  hoverMe?: () => void;
  unHoverMe?: () => void;
};

export function useHover(subscriber?: string): HoverHook {
  const hoverStore = useContext(HoverContext);
  if (!hoverStore)
    throw new Error("useHover must be used within a HoverProvider");
  return useStore(hoverStore, (s) => ({
    hover: subscriber !== undefined && s.hoverElement == subscriber,
    hoverMe: () => s.hoverThis(subscriber),
    unHoverMe: () => s.hoverThis(),
  }));
}
