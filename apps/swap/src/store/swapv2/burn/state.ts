import { BURN_FIELD } from "constants/swap";

export interface SwapBurnState {
  typedValue: string;
  independentField: BURN_FIELD;
}

export const initialState: SwapBurnState = {
  independentField: BURN_FIELD.LIQUIDITY_PERCENT,
  typedValue: "0",
};
