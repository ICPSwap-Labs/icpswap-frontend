import { createAction } from "@reduxjs/toolkit";
import { ICPPriceInfo, TokenMetadata, TokenRoots } from "types/token";
import { SupportedLocale } from "constants/locales";
import { TokenListMetadata } from "types/token-list";

export const updateXDR2USD = createAction<number>("global/updateXDR2USD");

export const updateDrawerWidth = createAction<number>("global/updateDrawerWidth");

export const updateICPPriceList = createAction<ICPPriceInfo[]>("global/updateICPPriceList");

export const addCatchToken = createAction<TokenMetadata[]>("global/addCatchToken");

export const updateUserLocale = createAction<SupportedLocale>("global/updateUserLocale");

export const updateTokenList = createAction<TokenListMetadata[]>("global/updateTokenList");

export const updatePoolStandardInitialed = createAction<boolean>("global/updatePoolStandardInitialed");

export const updateTokenSNSRootId = createAction<{ root_id: string; id: string }>("global/updateTokenSNSRootId");
