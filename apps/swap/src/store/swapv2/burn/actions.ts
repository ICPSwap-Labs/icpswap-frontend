import { createAction } from "@reduxjs/toolkit";
import { BURN_FIELD } from "constants/swap";

export interface updateTypedInputPayload {
  independentField: BURN_FIELD;
  typedValue: string;
}

export const updateTypedInput = createAction<updateTypedInputPayload>("swapV2Burn/updateTypedInput");

export const resetBurnState = createAction<void>("swapV2Burn/resetBurnState");
