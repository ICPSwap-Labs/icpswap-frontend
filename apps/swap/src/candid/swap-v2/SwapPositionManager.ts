import type { Principal } from "@dfinity/principal";

export type Address = string;
export type Address__1 = string;
export type BoolResult = { ok: boolean } | { err: string };
export type BoolResult__1 = { ok: boolean } | { err: string };
export interface CollectParams {
  tokenId: bigint;
  internalCall: boolean;
  recipient: Principal;
  amount0Max: string;
  amount1Max: string;
}
export interface DecreaseLiquidityParams {
  tokenId: bigint;
  liquidity: string;
  recipient: Principal;
  amount0Min: string;
  amount1Min: string;
  deadline: bigint;
}
export interface IncreaseLiquidityParams {
  tokenId: bigint;
  recipient: Principal;
  amount0Min: string;
  amount1Min: string;
  deadline: bigint;
  amount0Desired: string;
  amount1Desired: string;
}
export interface LiquidityType {
  liquidity: bigint;
  amount0: bigint;
  amount1: bigint;
}
export interface MintParams {
  fee: bigint;
  tickUpper: bigint;
  recipient: Principal;
  amount0Min: string;
  amount1Min: string;
  deadline: bigint;
  token0: Address__1;
  token1: Address__1;
  amount0Desired: string;
  amount1Desired: string;
  tickLower: bigint;
}
export interface MintResult {
  tokenId: bigint;
  liquidity: bigint;
  amount0: bigint;
  amount1: bigint;
}
export type NatResult = { ok: bigint } | { err: string };
export interface PoolKey {
  fee: bigint;
  token0: Address__1;
  token1: Address__1;
}
export interface Position {
  tickUpper: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
  operator: Address__1;
  feeGrowthInside1LastX128: bigint;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  nonce: bigint;
  tickLower: bigint;
  poolId: bigint;
}
export interface QueryPositionResult {
  fee: bigint;
  tickUpper: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
  operator: Address__1;
  feeGrowthInside1LastX128: bigint;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  token0: Address__1;
  token1: Address__1;
  nonce: bigint;
  tickLower: bigint;
  poolId: bigint;
}
export type ResponseResult = { ok: string } | { err: string };
export type ResponseResult_1 = { ok: ResultAmount } | { err: string };
export type ResponseResult_10 = { ok: Array<string> } | { err: string };
export type ResponseResult_2 = { ok: QueryPositionResult } | { err: string };
export type ResponseResult_3 = { ok: Array<bigint> } | { err: string };
export type ResponseResult_4 = { ok: MintResult } | { err: string };
export type ResponseResult_5 = { ok: LiquidityType } | { err: string };
export type ResponseResult_6 = { ok: VolumeMapType } | { err: string };
export type ResponseResult_7 = { ok: Array<TickLiquidityInfo> } | { err: string };
export type ResponseResult_8 = { ok: Array<TVLResult> } | { err: string };
export type ResponseResult_9 = { ok: Address } | { err: string };
export interface ResultAmount {
  amount0: bigint;
  amount1: bigint;
}
export interface TVLResult {
  token0TVL: bigint;
  token1TVL: bigint;
}
export interface TickLiquidityInfo {
  tickIndex: bigint;
  price0Decimal: bigint;
  liquidityNet: bigint;
  price0: bigint;
  price1: bigint;
  liquidityGross: bigint;
  price1Decimal: bigint;
}
export interface VolumeMapType {
  tokenA: bigint;
  tokenB: bigint;
}
export interface _SERVICE {
  addAdmin: (arg_0: string) => Promise<BoolResult__1>;
  burn: (arg_0: bigint) => Promise<ResponseResult_1>;
  collect: (arg_0: CollectParams) => Promise<ResponseResult_1>;
  collectInInvalidPosition: (arg_0: CollectParams) => Promise<ResponseResult_1>;
  createAndInitializePoolIfNecessary: (
    arg_0: Address,
    arg_1: string,
    arg_2: Address,
    arg_3: string,
    arg_4: bigint,
    arg_5: string,
  ) => Promise<ResponseResult_9>;
  cycleAvailable: () => Promise<NatResult>;
  cycleBalance: () => Promise<NatResult>;
  decreaseLiquidity: (arg_0: DecreaseLiquidityParams) => Promise<ResponseResult_1>;
  decreaseLiquidityInInvalidPosition: (arg_0: DecreaseLiquidityParams) => Promise<ResponseResult_1>;
  getAdminList: () => Promise<ResponseResult_10>;
  getApproved: (arg_0: bigint) => Promise<ResponseResult_9>;
  getBaseDataStructureCanister: (arg_0: string) => Promise<string>;
  getPoolTVL: (arg_0: Array<PoolKey>) => Promise<ResponseResult_8>;
  getPositionByPoolAddress: (arg_0: Address) => Promise<Array<Position>>;
  getTickInfos: (arg_0: string) => Promise<ResponseResult_7>;
  getTotalVolume: (arg_0: string) => Promise<ResponseResult_6>;
  increaseLiquidity: (arg_0: IncreaseLiquidityParams) => Promise<ResponseResult_5>;
  invalidPositions: (arg_0: bigint) => Promise<ResponseResult_2>;
  mint: (arg_0: MintParams) => Promise<ResponseResult_4>;
  ownerInvalidTokens: (arg_0: string) => Promise<ResponseResult_3>;
  ownerTokens: (arg_0: string) => Promise<ResponseResult_3>;
  positions: (arg_0: bigint) => Promise<ResponseResult_2>;
  refreshIncome: (arg_0: bigint) => Promise<ResponseResult_1>;
  refreshInvalidIncome: (arg_0: bigint) => Promise<ResponseResult_1>;
  removeAdmin: (arg_0: string) => Promise<BoolResult__1>;
  removeSwapPool: (arg_0: Address) => Promise<BoolResult>;
  setBaseDataStructureCanister: (arg_0: string) => Promise<undefined>;
  setLockServerCanisterId: (arg_0: string) => Promise<undefined>;
  setSwapNFTCanisterId: (arg_0: string) => Promise<undefined>;
  swapNFTCanisterId: () => Promise<string>;
  tokenURI: (arg_0: bigint) => Promise<ResponseResult>;
  transfer: (arg_0: bigint, arg_1: string) => Promise<ResponseResult>;
}
