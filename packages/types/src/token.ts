export enum TOKEN_STANDARD {
  EXT = "EXT",
  DIP20 = "DIP20",
  ICP = "ICP",
  DIP20_WICP = "DIP20-WICP",
  DIP20_XTC = "DIP20-XTC",
  ICRC1 = "ICRC1",
  ICRC2 = "ICRC2",
}

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

export type TokenTransType = { burn: null } | { mint: null } | { approve: null } | { transfer: null };

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
  standardType: TOKEN_STANDARD;
  symbol: string;
  canisterId: string;
  logo: string;
  totalSupply: bigint;
  transFee: bigint;
};

export type StorageTokenInfo = {
  decimals: number;
  name: string;
  standardType: TOKEN_STANDARD;
  symbol: string;
  canisterId: string;
  logo: string;
  totalSupply: string;
  transFee: string;
};
