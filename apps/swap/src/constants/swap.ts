import { ICP, WRAPPED_ICP } from "constants/tokens";
import { isIC } from "./server";

export enum SWAP_FIELD {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
}

export const DEFAULT_SWAP_ID = isIC ? ICP.address : WRAPPED_ICP.address;

export * from "./mint";
