import { createAction } from "@reduxjs/toolkit";

export const updateUserSlippage = createAction<{ type: string; value: number }>("swapV2Cache/updateUserSlippage");
