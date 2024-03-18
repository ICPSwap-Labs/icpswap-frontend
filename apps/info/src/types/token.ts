import { Principal } from "@dfinity/principal";

export type BalanceRequest = { token: string; user: { [key: string]: string | Principal } };

export type TokenAllowanceRequest = {
  owner: { [key: string]: string | Principal };
  subaccount: [] | [Array<number>];
  spender: Principal;
};

export interface TokenMetadata {
  decimals: number;
  name: string;
  standardType: string;
  symbol: string;
  canisterId: Principal;
}

export type Metadata = {
  decimals: number;
  metadata: [] | [Array<number>];
  name: string;
  symbol: string;
};

export type fungibleMetadata = {
  fungible: Metadata;
};

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
  usd: number;
  timestamp: string;
  xdr: number;
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
