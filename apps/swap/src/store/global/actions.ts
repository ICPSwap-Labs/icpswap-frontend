import { createAction } from "@reduxjs/toolkit";
import { SupportedLocale } from "constants/locales";
import { TokenListMetadata } from "types/token-list";
import { ChainKeyETHMinterInfo, type IcpSwapAPITokenInfo } from "@icpswap/types";

export const updateUserLocale = createAction<SupportedLocale>("global/updateUserLocale");

export const updateTokenList = createAction<TokenListMetadata[]>("global/updateTokenList");

export const updateAllSwapTokens = createAction<IcpSwapAPITokenInfo[]>("global/updateAllSwapTokens");

export const updateWalletConnector = createAction<boolean>("global/updateWalletConnector");

export const updateBridgeTokens = createAction<string[]>("global/updateBridgeTokens");

export const updateGlobalMinterInfo = createAction<{ minterInfo: ChainKeyETHMinterInfo }>(
  "global/updateGlobalMinterInfo",
);

export const updateDefaultTokens = createAction<string[]>("global/updateDefaultTokens");

export const updateDefaultChartType = createAction<string>("global/updateDefaultChartType");
