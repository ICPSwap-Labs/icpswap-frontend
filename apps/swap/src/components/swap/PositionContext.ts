import { createContext } from "react";
import BigNumber from "bignumber.js";

export interface PositionContextProps {
  allPositionsUSDValue: BigNumber | undefined;
  setAllPositionsUSDValue: (id: string, totalUSDValue: BigNumber) => void;
  counter: number;
  updateCounter: () => void;
}

export default createContext<PositionContextProps>({} as PositionContextProps);
