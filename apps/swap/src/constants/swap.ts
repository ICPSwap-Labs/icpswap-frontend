import { ICP, WRAPPED_ICP, ICS } from "@icpswap/tokens";

import { isIC } from "./server";

export enum SWAP_FIELD {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
}

export const DEFAULT_SWAP_INPUT_ID = isIC ? ICP.address : WRAPPED_ICP.address;
export const DEFAULT_SWAP_OUTPUT_ID = isIC ? ICS.address : ICS.address;

export const SWAP_REFRESH_KEY = "swap";

export const SWAP_LIMIT_REFRESH_KEY = "SWAP_LIMIT";

export * from "./mint";
