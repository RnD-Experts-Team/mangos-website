"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const IntroDoneContext = createContext(false);
const SetIntroDoneContext = createContext<(done: boolean) => void>(() => {});

/** Shares "has the intro finished" between `IntroScreen` and whatever should wait for it. */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  return (
    <SetIntroDoneContext.Provider value={setDone}>
      <IntroDoneContext.Provider value={done}>{children}</IntroDoneContext.Provider>
    </SetIntroDoneContext.Provider>
  );
}

export function useIntroDone() {
  return useContext(IntroDoneContext);
}

export function useSetIntroDone() {
  return useContext(SetIntroDoneContext);
}
