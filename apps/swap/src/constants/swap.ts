import { ICP, WRAPPED_ICP, ICS, GHOST } from "@icpswap/tokens";
import { isIC } from "./server";

export enum SWAP_FIELD {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
}

export const DEFAULT_SWAP_INPUT_ID = isIC ? ICP.address : WRAPPED_ICP.address;
export const DEFAULT_SWAP_OUTPUT_ID = isIC ? GHOST.address : GHOST.address;

export * from "./mint";
