import { createAction } from "@reduxjs/toolkit";
import type { NnsTokenInfo } from "@icpswap/types";

export const updateSnsAllTokensInfo = createAction<NnsTokenInfo[]>("global/updateSnsAllTokensInfo");
