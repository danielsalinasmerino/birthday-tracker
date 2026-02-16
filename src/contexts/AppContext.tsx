import { type ReactNode } from "react";
import { AppContext } from "./appContext";

interface AppProviderProps {
  currentUserId: string;
  children: ReactNode;
}

export function AppProvider({ currentUserId, children }: AppProviderProps) {
  return (
    <AppContext.Provider value={{ currentUserId }}>
      {children}
    </AppContext.Provider>
  );
}
