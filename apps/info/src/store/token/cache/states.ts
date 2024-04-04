import { TOKEN_STANDARD } from "@icpswap/types";

export interface TokenCacheState {
  standards: { [canisterId: string]: TOKEN_STANDARD };
  caps: { [canisterId: string]: string };
}

export const initialState: TokenCacheState = {
  standards: {},
  caps: {},
};
