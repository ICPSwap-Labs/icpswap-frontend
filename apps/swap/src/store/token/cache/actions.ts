import { createAction } from "@reduxjs/toolkit";
import { TOKEN_STANDARD } from "constants/tokens";

export const updateTokenStandard = createAction<{ canisterId: string; standard: TOKEN_STANDARD }>(
  "token/updateTokenStandard",
);

export const updateAllTokenIds = createAction<string>("token/updateAllTokenIds");
