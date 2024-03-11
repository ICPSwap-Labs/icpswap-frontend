import { createAction } from "@reduxjs/toolkit";
import { FIELD } from "constants/swap";

export const updateFiled = createAction<{ field: FIELD; typedValue: string }>("swapLiquidity/updateFiled");

export const updateLeftRange = createAction<string>("swapLiquidity/updateLeftRange");

export const updateRightRange = createAction<string>("swapLiquidity/updateRightRange");

export const updateStartPrice = createAction<string>("swapLiquidity/updateStartPrice");

export const updateFullRange = createAction<void>("swapLiquidity/updateFullRange");

export const resetMintState = createAction<void>("swapLiquidity/resetMintState");
