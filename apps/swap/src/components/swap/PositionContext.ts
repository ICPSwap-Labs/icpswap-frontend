import { createContext } from "react";
import { BigNumber } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { UserPosition, type PositionKey } from "types/swap";

export interface PositionContextProps {
  allPositionsUSDValue: { [key: PositionKey]: BigNumber | undefined } | undefined;
  setAllPositionsUSDValue: (id: PositionKey, totalUSDValue: BigNumber) => void;
  positionFees: { [id: PositionKey]: BigNumber | undefined } | undefined;
  positionFeesValue: BigNumber | undefined;
  setPositionFees: (id: PositionKey, fees: BigNumber) => void;
  refreshTrigger: number;
  setRefreshTrigger: () => void;
  allPositions: UserPosition[] | Null;
  setAllPositions: (positions: UserPosition[] | Null) => void;
  allStakedPositions: UserPosition[] | Null;
  setAllStakedPositions: (positions: UserPosition[] | Null) => void;
  setHiddenNumbers: (key: PositionKey, hidden: boolean) => void;
}

export const PositionContext = createContext<PositionContextProps>({} as PositionContextProps);
