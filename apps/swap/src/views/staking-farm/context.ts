import { createContext } from "react";

export interface FarmContextProps {
  unStakedFarms: string[];
  updateUnStakedFarms: (farm: string) => void;
  deleteUnStakedFarms: (farm: string) => void;
}

export default createContext<FarmContextProps>({} as FarmContextProps);
