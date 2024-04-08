import type { Principal } from "@dfinity/principal";
import { Override } from "@icpswap/types";

export type { TokenHolder, TokenHolderArgs } from "@icpswap/candid";

export interface Transaction {
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

export type TransactionRequest = {
  hash?: string;
  user?: User;
  offset?: number;
  limit?: number;
  index?: number;
};

export type User = { principal?: Principal; address?: string };

export type SetFeeToRequest = User;

export type BalanceRequest = {
  token: string;
  user: User;
  subaccount?: number[];
};

export type TransferRequest = {
  to: User;
  token?: string;
  notify?: boolean;
  from: User;
  memo?: number[] | bigint;
  subaccount?: number[];
  nonce?: bigint;
  amount: bigint;
  create_at_time?: bigint;
  from_sub_account?: number[];
  fee?: bigint;
};

export type TokenTransferRequest = TransferRequest;

export type TokenAllowanceRequest = {
  owner: User;
  subaccount?: number[];
  spender: Principal;
  spenderSub?: number[];
};

export type Metadata = {
  decimals: number;
  name: string;
  symbol: string;
  logo: string;
  fee: bigint;
};

export type ApproveRequest = {
  subaccount?: number[];
  allowance: bigint;
  spender: Principal;
  spenderSub?: number[];
  fee?: bigint;
  expires_at?: bigint;
  expected_allowance?: bigint;
};

export type TokenApproveRequest = Override<ApproveRequest, { account: string | Principal }>;

export type { DIP20Metadata } from "@icpswap/candid";

export enum TOKEN_STANDARD {
  EXT = "EXT",
  DIP20 = "DIP20",
  ICP = "ICP",
  DIP20_WICP = "DIP20-WICP",
  DIP20_XTC = "DIP20-XTC",
  ICRC1 = "ICRC1",
  ICRC2 = "ICRC2",
}
