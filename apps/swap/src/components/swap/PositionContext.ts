import { createContext, useContext } from "react";
import { BigNumber } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { type PositionKey, UserPositionByList, UserPositionForFarm } from "types/swap";

export interface PositionContextProps {
  allPositionsUSDValue: { [key: PositionKey]: BigNumber | undefined } | undefined;
  setAllPositionsUSDValue: (id: PositionKey, totalUSDValue: BigNumber) => void;
  positionFees: { [id: PositionKey]: BigNumber | undefined } | undefined;
  positionFeesValue: BigNumber | undefined;
  setPositionFees: (id: PositionKey, fees: BigNumber) => void;
  allPositions: UserPositionByList[] | Null;
  setAllPositions: (positions: UserPositionByList[] | Null) => void;
  allStakedPositions: UserPositionForFarm[] | Null;
  setAllStakedPositions: (positions: UserPositionForFarm[] | Null) => void;
  setHiddenNumbers: (key: PositionKey, hidden: boolean) => void;
  refreshTrigger: number;
  setRefreshTrigger: () => void;
}

export const PositionContext = createContext<PositionContextProps>({} as PositionContextProps);

export const usePositionContext = () => useContext(PositionContext);
