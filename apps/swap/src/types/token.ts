import { Principal } from "@dfinity/principal";
import { Override } from "@icpswap/types";
import { TOKEN_STANDARD } from "constants/tokens";
import type { TokenApproveArgs } from "@icpswap/types";

export type { Metadata as DIP20Metadata } from "candid/dip20/dip20";

export type BalanceRequest = { token: string; user: { [key: string]: string | Principal } };

export type TokenAllowanceRequest = {
  owner: { [key: string]: string | Principal };
  subaccount: [] | [Array<number>];
  spender: Principal;
};

export type TokenApproveRequest = Override<TokenApproveArgs, { account: string | Principal }>;

export interface TokenMetadata {
  decimals: number;
  metadata: [] | [Array<number>];
  name: string;
  standardType: TOKEN_STANDARD;
  symbol: string;
  canisterId: Principal;
}

export type Metadata = {
  decimals: number;
  name: string;
  symbol: string;
  logo: string;
  fee: bigint;
};

export type fungibleMetadata = {
  fungible: Metadata;
};

export type TokenInfo = Override<
  TokenMetadata,
  {
    logo: string;
    transFee: bigint;
    canisterId: string;
    standardType: TOKEN_STANDARD;
  }
>;

export interface TokenCanisterInfo {
  cycleAvailable: bigint;
  decimals: bigint;
  cycleBalance: bigint;
  owner: Principal;
  logo: string;
  name: string;
  totalSupply: bigint;
  timestamp: bigint;
  totalUsers: bigint;
  transFee: bigint;
  symbol: string;
  canisterId?: string;
}

export type ICPPriceInfo = {
  value: number;
  timestamp: string;
  xdr: string;
};

export type TokenAllowance = {
  spender: string;
  token: string;
  tokenCanisterId: string;
};

export type TokenInfo__1 = {
  id: bigint;
  decimals: bigint;
  accountId: string;
  owner: Principal;
  logo: string;
  name: string;
  totalSupply: bigint;
  timestamp: bigint;
  transFee: bigint;
  symbol: string;
  canisterId: Principal;
};
