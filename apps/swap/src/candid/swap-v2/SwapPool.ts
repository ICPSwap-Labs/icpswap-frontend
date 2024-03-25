import type { Principal } from "@dfinity/principal";

export type Address = string;
export type Address__1 = string;
export interface AmountAndCycleResult {
  cycles: bigint;
  amount0: bigint;
  amount1: bigint;
}
export interface InitParameters {
  fee: bigint;
  tickSpacing: bigint;
  token1Standard: string;
  token0: Address;
  token1: Address;
  factory: Address;
  token0Standard: string;
  canisterId: string;
}
export type NatResult = { ok: bigint } | { err: string };
export interface PaymentEntry {
  token: Address;
  value: bigint;
  tokenStandard: string;
  recipient: Principal;
  payer: Principal;
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
export interface PositionInfo {
  tokensOwed0: bigint;
  tokensOwed1: bigint;
  feeGrowthInside1LastX128: bigint;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
}
export type ResponseResult = { ok: SwapResult } | { err: string };
export type ResponseResult_1 =
  | {
      ok: { cycles: bigint; amount0: bigint; amount1: bigint };
    }
  | { err: string };
export type ResponseResult_2 = { ok: AmountAndCycleResult } | { err: string };
export type ResponseResult_3 = { ok: Array<string> } | { err: string };
export type ResponseResult_4 = { ok: ResultAmount } | { err: string };
export interface ResultAmount {
  amount0: bigint;
  amount1: bigint;
}
export interface SharedSlot0 {
  observationCardinalityNext: bigint;
  sqrtPriceX96: bigint;
  observationIndex: bigint;
  feeProtocol: bigint;
  tick: bigint;
  unlocked: boolean;
  observationCardinality: bigint;
}
export interface SnapshotCumulativesInsideResult {
  tickCumulativeInside: bigint;
  secondsPerLiquidityInsideX128: bigint;
  secondsInside: bigint;
}
export interface SwapPool {
  balance: (arg_0: string) => Promise<NatResult>;
  balance0: () => Promise<NatResult>;
  balance1: () => Promise<NatResult>;
  burn: (arg_0: bigint, arg_1: bigint, arg_2: bigint) => Promise<ResponseResult_2>;
  claimSwapFeeRepurchase: () => Promise<undefined>;
  collect: (arg_0: Principal, arg_1: bigint, arg_2: bigint, arg_3: bigint, arg_4: bigint) => Promise<ResponseResult_2>;
  collectProtocol: (arg_0: Principal, arg_1: bigint, arg_2: bigint) => Promise<ResponseResult_4>;
  cycleAvailable: () => Promise<bigint>;
  cycleBalance: () => Promise<bigint>;
  flash: (arg_0: Principal, arg_1: bigint, arg_2: bigint, arg_3: string) => Promise<TextResult>;
  get24HVolume: () => Promise<VolumeMapType>;
  getAdminList: () => Promise<ResponseResult_3>;
  getPosition: (arg_0: string) => Promise<PositionInfo>;
  getSlot0: () => Promise<SharedSlot0>;
  getStandard: (arg_0: string) => Promise<string>;
  getSwapFeeRepurchase: () => Promise<{ amount0: bigint; amount1: bigint }>;
  getSwapTokenMap: (arg_0: string) => Promise<bigint>;
  getTickInfos: () => Promise<Array<TickLiquidityInfo>>;
  getTickSpacing: () => Promise<bigint>;
  getTotalVolume: () => Promise<VolumeMapType>;
  getWalletAddress: () => Promise<Address__1>;
  increaseObservationCardinalityNext: (arg_0: Type__3) => Promise<TextResult>;
  info: () => Promise<PoolInfo>;
  infoWithNoBalance: () => Promise<PoolInfo>;
  init: (arg_0: InitParameters) => Promise<undefined>;
  initAdminList: (arg_0: Array<string>) => Promise<undefined>;
  initialize: (arg_0: Type__2) => Promise<undefined>;
  lockPool: () => Promise<undefined>;
  mint: (
    arg_0: Principal,
    arg_1: Type,
    arg_2: Type,
    arg_3: Type__1,
    arg_4: bigint,
    arg_5: bigint,
  ) => Promise<ResponseResult_2>;
  quoter: (arg_0: bigint, arg_1: bigint, arg_2: boolean, arg_3: bigint, arg_4: bigint) => Promise<ResponseResult_1>;
  rollBackData: () => Promise<undefined>;
  rollBackTransfer: () => Promise<Array<PaymentEntry>>;
  setFeeProtocol: (arg_0: bigint, arg_1: bigint) => Promise<TextResult>;
  setLockServerCanisterId: (arg_0: string) => Promise<undefined>;
  setSwapFeeHolderCanisterId: (arg_0: Principal) => Promise<undefined>;
  setSwapFeeRepurchase: (arg_0: bigint, arg_1: bigint) => Promise<undefined>;
  setTransFeeCache: () => Promise<undefined>;
  snapshotCumulativesInside: (arg_0: Type, arg_1: Type) => Promise<SnapshotCumulativesInsideResult>;
  swap: (
    arg_0: Principal,
    arg_1: bigint,
    arg_2: bigint,
    arg_3: boolean,
    arg_4: bigint,
    arg_5: bigint,
  ) => Promise<ResponseResult>;
  transFee: (arg_0: string) => Promise<NatResult>;
  transFee0: () => Promise<NatResult>;
  transFee0Cache: () => Promise<NatResult>;
  transFee1: () => Promise<NatResult>;
  transFee1Cache: () => Promise<NatResult>;
  transFeeCache: (arg_0: string) => Promise<NatResult>;
  unlockPool: () => Promise<undefined>;
}
export interface SwapResult {
  feeAmount: bigint;
  cycles: bigint;
  amount0: bigint;
  amount1: bigint;
}
export type TextResult = { ok: string } | { err: string };
export interface TickLiquidityInfo {
  tickIndex: bigint;
  price0Decimal: bigint;
  liquidityNet: bigint;
  price0: bigint;
  price1: bigint;
  liquidityGross: bigint;
  price1Decimal: bigint;
}
export type Type = bigint;
export type Type__1 = bigint;
export type Type__2 = bigint;
export type Type__3 = bigint;
export interface VolumeMapType {
  tokenA: bigint;
  tokenB: bigint;
}
export type _SERVICE = SwapPool
