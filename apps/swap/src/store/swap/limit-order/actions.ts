import type { Null } from "@icpswap/types";
import { createAction } from "@reduxjs/toolkit";

export type PoolCanisterRecord = { key: string; id: string };

export const updatePlaceOrderPositionId = createAction<bigint | Null>("limitOrder/updatePlaceOrderPositionId");
