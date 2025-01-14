import { createAction } from "@reduxjs/toolkit";
import { Null } from "@icpswap/types";

export type PoolCanisterRecord = { key: string; id: string };

export const updateSwapOutAmount = createAction<{ key: string; value: bigint | undefined }>(
  "limitOrder/updateSwapOutAmount",
);

export const updatePlaceOrderPositionId = createAction<bigint | Null>("limitOrder/updatePlaceOrderPositionId");
