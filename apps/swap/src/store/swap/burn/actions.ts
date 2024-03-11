import { createAction } from "@reduxjs/toolkit";
import { BURN_FIELD } from "constants/swap";

export interface updateTypedInputPayload {
  independentField: BURN_FIELD;
  typedValue: string;
}

export const updateTypedInput = createAction<updateTypedInputPayload>("swapBurn/updateTypedInput");

export const resetBurnState = createAction<void>("swapBurn/resetBurnState");
