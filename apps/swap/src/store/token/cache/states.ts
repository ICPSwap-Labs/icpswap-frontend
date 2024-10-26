import { TOKEN_STANDARD } from "@icpswap/token-adapter";

export interface TokenCacheState {
  standards: { [canisterId: string]: TOKEN_STANDARD };
  allTokenIds: string[];
}

export const initialState: TokenCacheState = {
  standards: {},
  allTokenIds: [],
};
