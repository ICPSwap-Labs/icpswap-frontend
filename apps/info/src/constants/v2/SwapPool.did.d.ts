import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Address = string;
export type Address__1 = string;
export interface AmountAndCycleResult {
  'cycles' : bigint,
  'amount0' : bigint,
  'amount1' : bigint,
}
export interface InitParameters {
  'fee' : bigint,
  'tickSpacing' : bigint,
  'token1Standard' : string,
  'token0' : Address,
  'token1' : Address,
  'factory' : Address,
  'token0Standard' : string,
  'canisterId' : string,
}
export type Int24 = bigint;
export type Int256 = bigint;
export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface PaymentEntry {
  'token' : Address,
  'value' : bigint,
  'tokenStandard' : string,
  'recipient' : Principal,
  'payer' : Principal,
}
export interface PoolInfo {
  'fee' : bigint,
  'ticks' : Array<bigint>,
  'pool' : string,
  'liquidity' : bigint,
  'tickCurrent' : bigint,
  'token0' : string,
  'token1' : string,
  'sqrtRatioX96' : bigint,
  'balance0' : bigint,
  'balance1' : bigint,
}
export interface PositionInfo {
  'tokensOwed0' : bigint,
  'tokensOwed1' : bigint,
  'feeGrowthInside1LastX128' : bigint,
  'liquidity' : bigint,
  'feeGrowthInside0LastX128' : bigint,
}
export type ResponseResult = { 'ok' : SwapResult } |
  { 'err' : string };
export type ResponseResult_1 = {
    'ok' : { 'cycles' : bigint, 'amount0' : bigint, 'amount1' : bigint }
  } |
  { 'err' : string };
export type ResponseResult_2 = { 'ok' : AmountAndCycleResult } |
  { 'err' : string };
export type ResponseResult_3 = { 'ok' : Array<string> } |
  { 'err' : string };
export interface SharedSlot0 {
  'observationCardinalityNext' : bigint,
  'sqrtPriceX96' : bigint,
  'observationIndex' : bigint,
  'feeProtocol' : bigint,
  'tick' : bigint,
  'unlocked' : boolean,
  'observationCardinality' : bigint,
}
export interface SnapshotCumulativesInsideResult {
  'tickCumulativeInside' : bigint,
  'secondsPerLiquidityInsideX128' : bigint,
  'secondsInside' : bigint,
}
export interface SwapPool {
  'balance' : ActorMethod<[string], NatResult>,
  'balance0' : ActorMethod<[], NatResult>,
  'balance1' : ActorMethod<[], NatResult>,
  'burn' : ActorMethod<[bigint, bigint, bigint], ResponseResult_2>,
  'claimSwapFeeRepurchase' : ActorMethod<[], undefined>,
  'collect' : ActorMethod<
    [Principal, bigint, bigint, bigint, bigint],
    ResponseResult_2,
  >,
  'cycleAvailable' : ActorMethod<[], bigint>,
  'cycleBalance' : ActorMethod<[], bigint>,
  'get24HVolume' : ActorMethod<[], VolumeMapType>,
  'getAdminList' : ActorMethod<[], ResponseResult_3>,
  'getPosition' : ActorMethod<[string], PositionInfo>,
  'getSlot0' : ActorMethod<[], SharedSlot0>,
  'getStandard' : ActorMethod<[string], string>,
  'getSwapFeeRepurchase' : ActorMethod<
    [],
    { 'amount0' : bigint, 'amount1' : bigint },
  >,
  'getSwapTokenMap' : ActorMethod<[string], bigint>,
  'getTickInfos' : ActorMethod<[], Array<TickLiquidityInfo>>,
  'getTickSpacing' : ActorMethod<[], bigint>,
  'getTotalVolume' : ActorMethod<[], VolumeMapType>,
  'getWalletAddress' : ActorMethod<[], Address__1>,
  'increaseObservationCardinalityNext' : ActorMethod<[Uint16], TextResult>,
  'info' : ActorMethod<[], PoolInfo>,
  'infoWithNoBalance' : ActorMethod<[], PoolInfo>,
  'init' : ActorMethod<[InitParameters], undefined>,
  'initAdminList' : ActorMethod<[Array<string>], undefined>,
  'initialize' : ActorMethod<[Uint160], undefined>,
  'lockPool' : ActorMethod<[], undefined>,
  'mint' : ActorMethod<
    [Principal, Int24, Int24, Uint128, bigint, bigint],
    ResponseResult_2,
  >,
  'quoter' : ActorMethod<
    [bigint, bigint, boolean, bigint, bigint],
    ResponseResult_1,
  >,
  'rollBackData' : ActorMethod<[], undefined>,
  'rollBackTransfer' : ActorMethod<[], Array<PaymentEntry>>,
  'setAvailable' : ActorMethod<[boolean], undefined>,
  'setFeeProtocol' : ActorMethod<[bigint, bigint], TextResult>,
  'setLockServerCanisterId' : ActorMethod<[string], undefined>,
  'setSwapFeeHolderCanisterId' : ActorMethod<[Principal], undefined>,
  'setSwapFeeRepurchase' : ActorMethod<[bigint, bigint], undefined>,
  'setTransFeeCache' : ActorMethod<[], undefined>,
  'snapshotCumulativesInside' : ActorMethod<
    [Int24, Int24],
    SnapshotCumulativesInsideResult,
  >,
  'swap' : ActorMethod<
    [Principal, Int256, Uint160, boolean, bigint, bigint],
    ResponseResult,
  >,
  'transFee' : ActorMethod<[string], NatResult>,
  'transFee0' : ActorMethod<[], NatResult>,
  'transFee0Cache' : ActorMethod<[], NatResult>,
  'transFee1' : ActorMethod<[], NatResult>,
  'transFee1Cache' : ActorMethod<[], NatResult>,
  'transFeeCache' : ActorMethod<[string], NatResult>,
  'unlockPool' : ActorMethod<[], undefined>,
}
export interface SwapResult {
  'feeAmount' : bigint,
  'cycles' : bigint,
  'amount0' : bigint,
  'amount1' : bigint,
}
export type TextResult = { 'ok' : string } |
  { 'err' : string };
export interface TickLiquidityInfo {
  'tickIndex' : bigint,
  'price0Decimal' : bigint,
  'liquidityNet' : bigint,
  'price0' : bigint,
  'price1' : bigint,
  'liquidityGross' : bigint,
  'price1Decimal' : bigint,
}
export type Uint128 = bigint;
export type Uint16 = bigint;
export type Uint160 = bigint;
export interface VolumeMapType { 'tokenA' : bigint, 'tokenB' : bigint }
export interface _SERVICE extends SwapPool {}
