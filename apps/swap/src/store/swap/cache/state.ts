import {
  DEFAULT_BURN_SLIPPAGE,
  DEFAULT_SWAP_SLIPPAGE,
  DEFAULT_MINT_SLIPPAGE,
  DEFAULT_TRANSACTIONS_DEADLINE,
  DEFAULT_MULTIPLE_APPROVE,
} from "constants/swap";

export interface SwapCacheState {
  userExpertMode: boolean;
  userSingleHop: boolean;
  userSelectedToken: string[];
  userSlippage: { [key: string]: number };
  userTransactionsDeadline: number;
  taggedTokens: string[];
  showClosedPosition: boolean;
  userPositionPools: string[];
  multipleApprove: number;
  swapProAutoRefresh: boolean;
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
  taggedTokens: [],
  showClosedPosition: true,
  userPositionPools: [],
  multipleApprove: DEFAULT_MULTIPLE_APPROVE,
  swapProAutoRefresh: true,
};
