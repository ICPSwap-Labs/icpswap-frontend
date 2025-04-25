import { SWAP_FIELD } from "constants/index";
import { DEFAULT_SWAP_INPUT_ID, DEFAULT_SWAP_OUTPUT_ID } from "constants/swap";
import { type SwapPoolData } from "@icpswap/types";

export interface SwapState {
  [SWAP_FIELD.INPUT]: string;
  [SWAP_FIELD.OUTPUT]: string;
  typedValue: string;
  independentField: SWAP_FIELD;
  poolCanisterIds: { [key: string]: string };
  swapOutAmount: { [key: string]: bigint | undefined };
  allSwapPools: SwapPoolData[];
}

export const initialState: SwapState = {
  [SWAP_FIELD.INPUT]: DEFAULT_SWAP_INPUT_ID,
  [SWAP_FIELD.OUTPUT]: DEFAULT_SWAP_OUTPUT_ID,
  typedValue: "",
  independentField: SWAP_FIELD.INPUT,
  poolCanisterIds: {},
  swapOutAmount: {},
  allSwapPools: [],
};
