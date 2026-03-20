import type { NnsTokenInfo } from "@icpswap/types";
import { createAction } from "@reduxjs/toolkit";

export const updateSnsAllTokensInfo = createAction<NnsTokenInfo[]>("global/updateSnsAllTokensInfo");
