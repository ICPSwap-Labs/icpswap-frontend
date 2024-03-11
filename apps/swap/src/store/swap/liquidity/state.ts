import { FIELD } from "constants/swap";

export interface SwapLiquidityState {
  leftRangeValue: string | boolean;
  rightRangeValue: string | boolean;
  startPrice: string;
  independentField: FIELD; // The currency input currently
  typedValue: string;
}

export const initialState: SwapLiquidityState = {
  leftRangeValue: "",
  rightRangeValue: "",
  startPrice: "",
  independentField: FIELD.CURRENCY_A,
  typedValue: "",
};
