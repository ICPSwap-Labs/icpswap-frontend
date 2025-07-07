import { createAction } from "@reduxjs/toolkit";
import { SupportedLocale } from "constants/locales";
import { TokenListMetadata } from "types/token-list";
import { type IcpSwapAPITokenInfo } from "@icpswap/types";

export const updateUserLocale = createAction<SupportedLocale>("global/updateUserLocale");

export const updateTokenList = createAction<TokenListMetadata[]>("global/updateTokenList");

export const updateAllSwapTokens = createAction<IcpSwapAPITokenInfo[]>("global/updateAllSwapTokens");

export const updateWalletConnector = createAction<boolean>("global/updateWalletConnector");

export const updateBridgeTokens = createAction<string[]>("global/updateBridgeTokens");

export const updateTokenBalance = createAction<{ canisterId: string; balance: string }>("global/updateTokenBalance");
