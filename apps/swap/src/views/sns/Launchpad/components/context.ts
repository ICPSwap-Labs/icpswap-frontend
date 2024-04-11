import { createContext } from "react";

export interface LaunchContextProps {
  reload: number;
  setReload: (reload: number) => void;
}

export const LaunchContext = createContext({} as LaunchContextProps);
