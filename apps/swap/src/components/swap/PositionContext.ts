import { createContext } from "react";
import BigNumber from "bignumber.js";
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

export default createContext<PositionContextProps>({} as PositionContextProps);
