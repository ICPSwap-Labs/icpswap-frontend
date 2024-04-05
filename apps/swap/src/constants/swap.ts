import { ICP, WRAPPED_ICP, ckBTC } from "@icpswap/tokens";
import { isIC } from "./server";

export enum SWAP_FIELD {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
}

export const DEFAULT_SWAP_INPUT_ID = isIC ? ICP.address : WRAPPED_ICP.address;
export const DEFAULT_SWAP_OUTPUT_ID = isIC ? ckBTC.address : ckBTC.address;

export * from "./mint";
