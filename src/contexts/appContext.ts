import { createContext } from "react";

export interface AppContextType {
  currentUserId: string;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
