import { UserPosition } from "types/swapv2";
import { FIELD } from "constants/swap";

export interface SwapLiquidityState {
  userPositions: (UserPosition | undefined)[];
  leftRangeValue: string | boolean;
  rightRangeValue: string | boolean;
  startPrice: string;
  independentField: FIELD; // The currency input currently
  typedValue: string;
}

export const initialState: SwapLiquidityState = {
  userPositions: [],
  leftRangeValue: "",
  rightRangeValue: "",
  startPrice: "",
  independentField: FIELD.CURRENCY_A,
  typedValue: "",
};
