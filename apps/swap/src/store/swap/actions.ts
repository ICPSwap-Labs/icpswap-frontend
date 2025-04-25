import { createAction } from "@reduxjs/toolkit";
import { SWAP_FIELD } from "constants/swap";
import { type SwapPoolData } from "@icpswap/types";

export const selectCurrency = createAction<{ field: SWAP_FIELD; currencyId: string | undefined }>(
  "swap/selectCurrency",
);

export const switchCurrencies = createAction<void>("swap/switchCurrencies");

export const typeInput = createAction<{ field: SWAP_FIELD; typedValue: string }>("swap/typeInput");

export const clearSwapState = createAction<void>("swap/clearSwapState");

export type PoolCanisterRecord = { key: string; id: string };

export const updatePoolCanisterIds = createAction<PoolCanisterRecord>("swapCache/updatePoolCanisterIds");

export const updateSwapOutAmount = createAction<{ key: string; value: bigint | undefined }>("swap/updateSwapOutAmount");

export const updateAllSwapPools = createAction<SwapPoolData[]>("swap/updateAllSwapPools");
