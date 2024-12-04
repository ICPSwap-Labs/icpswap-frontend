import { createContext } from "react";
import { BigNumber } from "@icpswap/utils";
import { UserPosition, type PositionKey } from "types/swap";

export interface PositionContextProps {
  allPositionsUSDValue: { [key: PositionKey]: BigNumber | undefined } | undefined;
  setAllPositionsUSDValue: (id: PositionKey, totalUSDValue: BigNumber) => void;
  positionFees: { [id: PositionKey]: BigNumber | undefined } | undefined;
  positionFeesValue: BigNumber | undefined;
  setPositionFees: (id: PositionKey, fees: BigNumber) => void;
  refreshTrigger: number;
  setRefreshTrigger: () => void;
  allPositions: UserPosition[] | undefined;
  setAllPositions: (positions: UserPosition[]) => void;
  allStakedPositions: UserPosition[] | undefined;
  setAllStakedPositions: (positions: UserPosition[]) => void;
  setHiddenNumbers: (key: PositionKey, hidden: boolean) => void;
}

export const PositionContext = createContext<PositionContextProps>({} as PositionContextProps);
