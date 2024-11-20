import { isNullArgs } from "@icpswap/utils";
import { network, NETWORK } from "./server";

export const ASSETS_DECIMALS = 2;
export const ICP_BALANCE_DECIMALS = 4;
export const ICS_BALANCE_DECIMALS = 2;
export const MAX_TOKEN_MINT_NAME_LENGTH = 30;
export const MAX_TOKEN_MINT_SYMBOL_LENGTH = 15;

export const NONE_PRICE_SYMBOL = "--";
export const DEFAULT_PERCENT_SYMBOL = "0.00%";
export const TOKEN_AMOUNT_DISPLAY_DECIMALS = 8;
export const NONE_TOKEN_SYMBOL = "--";
export const EMPTY_CONTENT_SYMBOL = "--";

export const REACT_GA_TRACKING_ID = "UA-200662567-2";

export const MINT_TOKEN_CYCLES = 1860000000000;

export const MINT_NFT_PAY_MOUNT = 10;
export const NFT_UPLOAD_FILES = [
  "image",
  "video",
  "audio",
  "txt",
  "js",
  "ts",
  "pdf",
  "json",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "docx",
  "doc",
];

export const CurrencyAmountFormatDecimals = (decimals: number | bigint | undefined) => {
  if (isNullArgs(decimals)) return TOKEN_AMOUNT_DISPLAY_DECIMALS;
  if (Number(decimals) > TOKEN_AMOUNT_DISPLAY_DECIMALS) return TOKEN_AMOUNT_DISPLAY_DECIMALS;
  return Number(decimals);
};

export const INFO_URL_MAP = {
  [NETWORK.IC]: "https://info.icpswap.com",
};

export const INFO_URL = INFO_URL_MAP[network];

export const APP_URL = "https://app.icpswap.com";

export const DAYJS_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const V2SwapLink = "https://app.icpswap.com";

export const V3SwapLink = "https://app.icpswap.com";

export const AnonymousPrincipal = "2vxsx-fae";

export const MaxInt64 = (2 ** 64 - 1).toString();
export const APPROVE_MAX_NUMBER = Number.MAX_VALUE;

export const SAFE_INTEGER_LENGTH = 12;
export const SAFE_DECIMALS_LENGTH = 8;
export const MAX_SWAP_INPUT_LENGTH = 25;

export * from "./canister";
export * from "./server";
export * from "./tokens";
export * from "./swap";
export * from "./nft";
export * from "./types";
export * from "./icp";
export * from "./wallet";
export * from "./ckERC20";
