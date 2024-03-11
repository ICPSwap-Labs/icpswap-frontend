import { createAction } from "@reduxjs/toolkit";
import { TokenMetadata } from "types/token";
import { TOKEN_STANDARD } from "constants/tokens";

export const updateTokenStandard = createAction<{ canisterId: string; standard: TOKEN_STANDARD }>(
  "token/updateTokenStandard",
);

export const updateImportedToken = createAction<{ canisterId: string; metadata: TokenMetadata }>(
  "token/updateImportedToken",
);
