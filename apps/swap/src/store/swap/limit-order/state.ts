import { Null } from "@icpswap/types";
import { SWAP_FIELD } from "constants/index";
import { DEFAULT_SWAP_INPUT_ID, DEFAULT_SWAP_OUTPUT_ID } from "constants/swap";

export interface LimitOrderState {
  [SWAP_FIELD.INPUT]: { currencyId: string | undefined };
  [SWAP_FIELD.OUTPUT]: { currencyId: string | undefined };
  typedValue: string;
  independentField: SWAP_FIELD;
  swapOutAmount: { [key: string]: bigint | undefined };
  placeOrderPositionId: bigint | Null;
}

export const initialState: LimitOrderState = {
  [SWAP_FIELD.INPUT]: { currencyId: DEFAULT_SWAP_INPUT_ID },
  [SWAP_FIELD.OUTPUT]: { currencyId: DEFAULT_SWAP_OUTPUT_ID },
  typedValue: "",
  independentField: SWAP_FIELD.INPUT,
  swapOutAmount: {},
  placeOrderPositionId: null,
};
