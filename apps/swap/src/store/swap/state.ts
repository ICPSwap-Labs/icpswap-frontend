import { SWAP_FIELD } from "constants/index";
import { DEFAULT_SWAP_INPUT_ID, DEFAULT_SWAP_OUTPUT_ID } from "constants/swap";

export interface SwapState {
  [SWAP_FIELD.INPUT]: { currencyId: string | undefined };
  [SWAP_FIELD.OUTPUT]: { currencyId: string | undefined };
  typedValue: string;
  independentField: SWAP_FIELD;
  poolCanisterIds: { [key: string]: string };
  swapOutAmount: { [key: string]: bigint | undefined };
  decreaseLiquidityAmount: { [key: string]: { amount0: bigint | undefined; amount1: bigint | undefined } };
}

export const initialState: SwapState = {
  [SWAP_FIELD.INPUT]: { currencyId: DEFAULT_SWAP_INPUT_ID },
  [SWAP_FIELD.OUTPUT]: { currencyId: DEFAULT_SWAP_OUTPUT_ID },
  typedValue: "",
  independentField: SWAP_FIELD.INPUT,
  poolCanisterIds: {},
  swapOutAmount: {},
  decreaseLiquidityAmount: {},
};
