import { createAction } from "@reduxjs/toolkit";
import { SWAP_FIELD } from "constants/swap";
import { Null } from "@icpswap/types";

export const selectCurrency = createAction<{ field: SWAP_FIELD; currencyId: string | undefined }>(
  "limitOrder/selectCurrency",
);

export const switchCurrencies = createAction<void>("limitOrder/switchCurrencies");

export const typeInput = createAction<{ field: SWAP_FIELD; typedValue: string }>("limitOrder/typeInput");

export const clearSwapState = createAction<void>("limitOrder/clearSwapState");

export type PoolCanisterRecord = { key: string; id: string };

export const updateSwapOutAmount = createAction<{ key: string; value: bigint | undefined }>(
  "limitOrder/updateSwapOutAmount",
);

export const updatePlaceOrderPositionId = createAction<bigint | Null>("limitOrder/updatePlaceOrderPositionId");
