import type { Principal } from "@dfinity/principal";

export type NatResult = { ok: bigint } | { err: string };
export interface PublicPoolOverView {
  id: bigint;
  token0Id: string;
  token1Id: string;
  totalVolumeUSD: number;
  sqrtPrice: number;
  tvlToken0: number;
  tvlToken1: number;
  pool: string;
  tick: bigint;
  liquidity: bigint;
  token1Price: number;
  feeTier: bigint;
  volumeUSD: number;
  token1Standard: string;
  tvlUSD: number;
  volumeUSDWeek: number;
  txCount: bigint;
  token1Decimals: number;
  token0Standard: string;
  token0Symbol: string;
  volumeUSDChange: number;
  tvlUSDChange: number;
  token0Decimals: number;
  token0Price: number;
  token1Symbol: string;
  volumeUSDWeekChange: number;
}
export interface PublicSwapChartDayData {
  id: bigint;
  feeUSD: number;
  volumeUSD: number;
  tvlUSD: number;
  timestamp: bigint;
  txCount: bigint;
}
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
  cycleAvailable: () => Promise<NatResult>;
  cycleBalance: () => Promise<NatResult>;
  getAllPools: (arg_0: [] | [bigint]) => Promise<Array<PublicPoolOverView>>;
  getAllTransactions: (arg_0: bigint, arg_1: bigint) => Promise<Array<TransactionsType>>;
  getPool: (arg_0: string) => Promise<PublicPoolOverView>;
  getPoolChartData: (arg_0: string, arg_1: bigint, arg_2: bigint) => Promise<Array<PublicSwapChartDayData>>;
  getPoolTransactions: (arg_0: string, arg_1: bigint, arg_2: bigint) => Promise<Array<TransactionsType>>;
  getRollIndex: () => Promise<bigint>;
  getTvlRecord: () => Promise<string>;
  reset: () => Promise<undefined>;
  resetNowTimeTVL: () => Promise<undefined>;
  rollBackData: (arg_0: Array<TransactionsType>) => Promise<undefined>;
  saveTransactions: (arg_0: TransactionsType, arg_1: boolean) => Promise<undefined>;
}
