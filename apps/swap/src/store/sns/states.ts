import type { SnsTokensInfo } from "@icpswap/types";

export interface SnsState {
  snsAllTokensInfo: SnsTokensInfo[];
}

export const initialState: SnsState = {
  snsAllTokensInfo: [],
};
