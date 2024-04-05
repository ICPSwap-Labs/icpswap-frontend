import { TokenMetadata } from "types/token";
import { TOKEN_STANDARD } from "constants/tokens";

export interface TokenCacheState {
  standards: { [canisterId: string]: TOKEN_STANDARD };
  importedTokens: { [canisterId: string]: TokenMetadata };
  allTokenIds: string[];
}

export const initialState: TokenCacheState = {
  standards: {},
  importedTokens: {},
  allTokenIds: [],
};
