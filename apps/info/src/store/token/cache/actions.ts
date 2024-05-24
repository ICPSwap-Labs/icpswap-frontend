import { createAction } from "@reduxjs/toolkit";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";

export const updateTokenStandard = createAction<{ canisterId: string; standard: TOKEN_STANDARD }>(
  "tokenCache/updateTokenStandard",
);

export const updateTokenCapId = createAction<{ canisterId: string; capId: string }>("tokenCache/updateTokenCapId");
