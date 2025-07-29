"use client";

import { createContext, useContext, ReactNode } from "react";
import { User } from "./types";

const LiffContext = createContext<User | null>(null);

export function LiffProvider({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  return <LiffContext.Provider value={user}>{children}</LiffContext.Provider>;
}

export function useLiffProfile(): User {
  const ctx = useContext(LiffContext);
  if (!ctx) {
    throw new Error("useLiffProfile must be used within a LiffProvider");
  }
  return ctx;
}
