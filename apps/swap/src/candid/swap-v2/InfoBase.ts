import type { Principal } from "@dfinity/principal";

export type Address = string;
export type Address__1 = string;
export type NatResult = { ok: bigint } | { err: string };
export interface Page {
  content: Array<TransactionsType>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface PublicProtocolData {
  volumeUSD: number;
  feesUSD: number;
  tvlUSD: number;
  txCount: bigint;
  volumeUSDChange: number;
  tvlUSDChange: number;
  feeChange: number;
}
export interface PublicSwapChartDayData {
  id: bigint;
  feeUSD: number;
  volumeUSD: number;
  tvlUSD: number;
  timestamp: bigint;
  txCount: bigint;
}
export interface RecordPage {
  content: Array<TransactionsType>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface SwapRecordInfo {
  to: string;
  feeAmount: bigint;
  action: TransactionType;
  feeAmountTotal: bigint;
  token0Id: Address;
  token1Id: Address;
  token0AmountTotal: bigint;
  liquidityTotal: bigint;
  from: string;
  tick: bigint;
  feeTire: bigint;
  recipient: string;
  token0ChangeAmount: bigint;
  token1AmountTotal: bigint;
  liquidityChange: bigint;
  token1Standard: string;
  TVLToken0: bigint;
  TVLToken1: bigint;
  token0Fee: bigint;
  token1Fee: bigint;
  timestamp: bigint;
  token1ChangeAmount: bigint;
  token0Standard: string;
  price: bigint;
  poolId: string;
}
export type TransactionType =
  | { fee: null }
  | { burn: null }
  | { claim: null }
  | { mint: null }
  | { swap: null }
  | { addLiquidity: null }
  | { removeLiquidity: null }
  | { refreshIncome: null }
  | { transfer: null }
  | { collect: null };
export interface TransactionsType {
  to: string;
  action: _TransactionType;
  token0Id: string;
  token1Id: string;
  liquidityTotal: bigint;
  from: string;
  exchangePrice: number;
  hash: string;
  tick: bigint;
  token1Price: number;
  recipient: string;
  token0ChangeAmount: number;
  sender: string;
  exchangeRate: number;
  liquidityChange: bigint;
  token1Standard: string;
  token0Fee: number;
  token1Fee: number;
  timestamp: bigint;
  token1ChangeAmount: number;
  token1Decimals: number;
  token0Standard: string;
  amountUSD: number;
  amountToken0: number;
  amountToken1: number;
  poolFee: bigint;
  token0Symbol: string;
  token0Decimals: number;
  token0Price: number;
  token1Symbol: string;
  poolId: string;
}
export type _TransactionType =
  | { fee: null }
  | { burn: null }
  | { claim: null }
  | { mint: null }
  | { swap: null }
  | { addLiquidity: null }
  | { removeLiquidity: null }
  | { refreshIncome: null }
  | { transfer: null }
  | { collect: null };
export interface _SERVICE {
  addAdmin: (arg_0: string) => Promise<boolean>;
  cycleAvailable: () => Promise<NatResult>;
  cycleBalance: () => Promise<NatResult>;
  get: (arg_0: Address__1, arg_1: bigint, arg_2: bigint) => Promise<RecordPage>;
  getAddressAndCountByCondition: (
    arg_0: string,
    arg_1: string,
    arg_2: bigint,
    arg_3: bigint,
    arg_4: bigint,
  ) => Promise<Array<{ count: bigint; address: string }>>;
  getAdminList: () => Promise<Array<string>>;
  getAllTransactions: (
    arg_0: string,
    arg_1: string,
    arg_2: bigint,
    arg_3: [] | [TransactionType],
    arg_4: bigint,
    arg_5: bigint,
  ) => Promise<Page>;
  getBaseRecord: (arg_0: bigint, arg_1: bigint) => Promise<RecordPage>;
  getChartData: (arg_0: bigint, arg_1: bigint) => Promise<Array<PublicSwapChartDayData>>;
  getProtocolData: () => Promise<PublicProtocolData>;
  getSwapPositionManagerCanisterId: () => Promise<string>;
  getSwapUserAddress: () => Promise<Array<string>>;
  getSwapUserNum: () => Promise<bigint>;
  getTotalValueLockedUSD: () => Promise<bigint>;
  getTxCount: () => Promise<bigint>;
  isAdmin: (arg_0: string) => Promise<boolean>;
  push: (arg_0: SwapRecordInfo) => Promise<undefined>;
  removeAdmin: (arg_0: string) => Promise<boolean>;
  removeTokenList: (arg_0: string) => Promise<undefined>;
  resetAllData: () => Promise<undefined>;
  rollBackData: (arg_0: bigint, arg_1: bigint) => Promise<undefined>;
  rollBackData_Token: (arg_0: bigint, arg_1: bigint) => Promise<undefined>;
  rollBackSwapDayData: (arg_0: bigint, arg_1: bigint) => Promise<undefined>;
  rollBackUserRecord: () => Promise<undefined>;
  setCanister: (arg_0: string, arg_1: string) => Promise<undefined>;
  setSwapPositionManagerCanisterId: (arg_0: string) => Promise<undefined>;
}
