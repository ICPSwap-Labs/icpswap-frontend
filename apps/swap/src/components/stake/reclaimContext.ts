import { createContext } from "react";

export interface ReclaimContextProps {
  reclaimable: boolean;
  setReclaimable: (reclaimable: boolean) => void;
}

export const ReclaimContext = createContext<ReclaimContextProps>({} as ReclaimContextProps);
