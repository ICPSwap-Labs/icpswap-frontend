import { createAction } from "@reduxjs/toolkit";
import { ICPPriceInfo, TokenMetadata } from "types/token";
import { SupportedLocale } from "constants/locales";

export const storeTokenList = createAction<TokenMetadata[]>("global/storeTokenList");

export const updateICPBlocks = createAction<{
  blocks: string | number;
  secondBlocks: string | number;
}>("global/updateICPBlocks");

export const updateICPPriceList = createAction<ICPPriceInfo[]>("global/updateICPPriceList");

export const updateUserLocale = createAction<SupportedLocale>("global/updateUserLocale");

export const updateXDR2USD = createAction<number>("global/updateXDR2USD");
