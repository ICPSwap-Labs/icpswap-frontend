import { createAction } from "@reduxjs/toolkit";
import type { SnsTokensInfo } from "@icpswap/types";

export const updateSnsAllTokensInfo = createAction<SnsTokensInfo[]>("global/updateSnsAllTokensInfo");
