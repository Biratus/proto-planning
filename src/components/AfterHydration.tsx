"use client";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import LoadingBar from "./LoadingBar";

type HydrationState = {
  isHydrated: Boolean;
};

export const HydrationContext = createContext<HydrationState>({
  isHydrated: false,
});

export default function AfterHydration({ children }: PropsWithChildren) {
  const [isHydrated, setHydrated] = useState<Boolean>(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <HydrationContext.Provider value={{ isHydrated }}>
      {isHydrated ? children : <LoadingBar />}
    </HydrationContext.Provider>
  );
}
