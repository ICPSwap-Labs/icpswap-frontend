import { createAction } from "@reduxjs/toolkit";
import { FIELD } from "constants/swap";
import { UserPosition } from "types/swapv2";

export const updateUserPositions = createAction<(UserPosition | undefined)[]>("swapV2Liquidity/updateUserPositions");

export const updateFiled = createAction<{ field: FIELD; typedValue: string }>("swapV2Liquidity/updateFiled");

export const updateLeftRange = createAction<string>("swapV2Liquidity/updateLeftRange");

export const updateRightRange = createAction<string>("swapV2Liquidity/updateRightRange");

export const updateStartPrice = createAction<string>("swapV2Liquidity/updateStartPrice");

export const updateFullRange = createAction<void>("swapV2Liquidity/updateFullRange");

export const resetMintState = createAction<void>("swapV2Liquidity/resetMintState");
