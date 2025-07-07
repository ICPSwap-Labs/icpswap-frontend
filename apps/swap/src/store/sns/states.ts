import type { NnsTokenInfo } from "@icpswap/types";

export interface SnsState {
  snsAllTokensInfo: NnsTokenInfo[];
}

export const initialState: SnsState = {
  snsAllTokensInfo: [],
};
