import { Null } from "@icpswap/types";

export interface LimitOrderState {
  swapOutAmount: { [key: string]: bigint | undefined };
  placeOrderPositionId: bigint | Null;
}

export const initialState: LimitOrderState = {
  swapOutAmount: {},
  placeOrderPositionId: null,
};
