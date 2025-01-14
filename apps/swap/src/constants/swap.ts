import { ICP, WRAPPED_ICP, ICS } from "@icpswap/tokens";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";

import { isIC } from "./server";

export enum SWAP_FIELD {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
}

export const DEFAULT_SWAP_INPUT_ID = isIC ? ICP.address : WRAPPED_ICP.address;
export const DEFAULT_SWAP_OUTPUT_ID = isIC ? ICS.address : ICS.address;

export const SWAP_REFRESH_KEY = "swap";

export const LIQUIDITY_OWNER_REFRESH_KEY = "LIQUIDITY_OWNER_REFRESH_KEY";

export const SWAP_CHART_CURRENT_PRICE_COLOR = "#ffffff";
export const SWAP_CHART_RANGE_PRICE_COLOR = "#8672FF";

export const SWAP_CHART_RANGE_LEFT_COLOR = "#788686";
export const SWAP_CHART_RANGE_RIGHT_COLOR = "#bb8d00";
export const SWAP_CHART_RANGE_AREA_COLOR = "#0068FC";

export const icrc_standards = [TOKEN_STANDARD.ICRC1, TOKEN_STANDARD.ICRC2];

export * from "./mint";
