import type { Principal } from "@dfinity/principal";
export type Address = string;
export interface Page {
  content: Array<PoolInfo>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Pool {
  fee: bigint;
  ticks: Array<bigint>;
  liquidity: bigint;
  tickCurrent: bigint;
  token0: string;
  token1: string;
  sqrtRatioX96: bigint;
}
export interface PoolInfo {
  fee: bigint;
  ticks: Array<bigint>;
  pool: string;
  liquidity: bigint;
  tickCurrent: bigint;
  token0: string;
  token1: string;
  sqrtRatioX96: bigint;
  balance0: bigint;
  balance1: bigint;
}
export type PrincipalText = string;
export type TextResult = { ok: string } | { err: string };
export interface TradeOverview {
  tvl: bigint;
  tradeUserNum: bigint;
  volume: bigint;
  tradeSymbolNum: bigint;
}
export interface _SERVICE {
  _getPool: (arg_0: string) => Promise<Pool>;
  addAdmin: (arg_0: string) => Promise<boolean>;
  createPool: (arg_0: Address, arg_1: string, arg_2: Address, arg_3: string, arg_4: bigint) => Promise<PrincipalText>;
  cycleAvailable: () => Promise<bigint>;
  cycleBalance: () => Promise<bigint>;
  enableFeeAmount: (arg_0: bigint, arg_1: bigint) => Promise<TextResult>;
  getAdminList: () => Promise<Array<string>>;
  getInvalidPool: (arg_0: string) => Promise<PrincipalText>;
  getOverview: () => Promise<TradeOverview>;
  getPool: (arg_0: string) => Promise<PrincipalText>;
  getPoolIds: () => Promise<Array<string>>;
  getPoolList: () => Promise<Array<PoolInfo>>;
  getPoolListByPage: (arg_0: bigint, arg_1: bigint) => Promise<Page>;
  getPools: (arg_0: Array<string>) => Promise<Array<Pool>>;
  removeAdmin: (arg_0: string) => Promise<boolean>;
  removePool: (arg_0: Address) => Promise<undefined>;
  setBaseDataStructureCanister: (arg_0: string) => Promise<undefined>;
}
