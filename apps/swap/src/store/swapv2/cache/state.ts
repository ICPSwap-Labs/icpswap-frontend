import {
  DEFAULT_BURN_SLIPPAGE,
  DEFAULT_SWAP_SLIPPAGE,
  DEFAULT_MINT_SLIPPAGE,
  DEFAULT_TRANSACTIONS_DEADLINE,
} from "constants/swap";

export interface SwapCacheState {
  userExpertMode: boolean;
  userSingleHop: boolean;
  userSelectedToken: string[];
  userSlippage: { [key: string]: number };
  userTransactionsDeadline: number;
  poolCanisterIds: { [key: string]: string };
  taggedTokens: string[];
}

export const initialState: SwapCacheState = {
  userExpertMode: false,
  userSingleHop: false,
  userSelectedToken: [],
  userSlippage: {
    swap: DEFAULT_SWAP_SLIPPAGE,
    mint: DEFAULT_MINT_SLIPPAGE,
    burn: DEFAULT_BURN_SLIPPAGE,
  },
  userTransactionsDeadline: DEFAULT_TRANSACTIONS_DEADLINE,
  poolCanisterIds: {},
  taggedTokens: [],
};
