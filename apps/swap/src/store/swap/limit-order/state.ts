import type { Null } from "@icpswap/types";

export interface LimitOrderState {
  placeOrderPositionId: bigint | Null;
}

export const initialState: LimitOrderState = {
  placeOrderPositionId: null,
};
