export interface TokenTransaction {
  fee: bigint | undefined;
  status: string;
  transType: string;
  from_owner: string;
  from_sub: number[] | undefined;
  from_account: string;
  to_owner: string;
  to_sub: number[] | undefined;
  to_account: string;
  hash: string;
  memo: [] | [Array<number>];
  timestamp: bigint;
  index: bigint;
  amount: bigint;
}

export type TokenTransType =
  | { burn: null }
  | { mint: null }
  | { approve: null }
  | { transfer: null };

export type {
  WrapUser,
  WrapTransaction,
  WrapMintArgs,
  WrapWithdrawArgs,
  TokenApproveArgs,
  TokenHolder,
  TokenHolderArgs,
  TokenTransactionArgs,
  TokenTransferArgs,
  TokenTransferResult,
  TokenTransaction as CandidTokenTransaction,
} from "@icpswap/candid";

export type TokenInfo = {
  decimals: number;
  name: string;
  standardType: string;
  symbol: string;
  canisterId: string;
  logo: string;
  totalSupply: bigint;
  transFee: bigint;
};
