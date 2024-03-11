import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Address = string;
export type Address__1 = string;
export type BoolResult = { 'ok' : boolean } |
  { 'err' : string };
export type BoolResult__1 = { 'ok' : boolean } |
  { 'err' : string };
export interface CollectParams {
  'tokenId' : bigint,
  'internalCall' : boolean,
  'recipient' : Principal,
  'amount0Max' : string,
  'amount1Max' : string,
}
export interface DecreaseLiquidityParams {
  'tokenId' : bigint,
  'liquidity' : string,
  'recipient' : Principal,
  'amount0Min' : string,
  'amount1Min' : string,
  'deadline' : bigint,
}
export interface IncreaseLiquidityParams {
  'tokenId' : bigint,
  'recipient' : Principal,
  'amount0Min' : string,
  'amount1Min' : string,
  'deadline' : bigint,
  'amount0Desired' : string,
  'amount1Desired' : string,
}
export interface LiquidityType {
  'liquidity' : bigint,
  'amount0' : bigint,
  'amount1' : bigint,
}
export interface MintParams {
  'fee' : bigint,
  'tickUpper' : bigint,
  'recipient' : Principal,
  'amount0Min' : string,
  'amount1Min' : string,
  'deadline' : bigint,
  'token0' : Address__1,
  'token1' : Address__1,
  'amount0Desired' : string,
  'amount1Desired' : string,
  'tickLower' : bigint,
}
export interface MintResult {
  'tokenId' : bigint,
  'liquidity' : bigint,
  'amount0' : bigint,
  'amount1' : bigint,
}
export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface PoolKey {
  'fee' : bigint,
  'token0' : Address__1,
  'token1' : Address__1,
}
export interface PositionWithTokenAmount {
  'tickUpper' : bigint,
  'tokensOwed0' : bigint,
  'tokensOwed1' : bigint,
  'operator' : Address,
  'feeGrowthInside1LastX128' : bigint,
  'liquidity' : bigint,
  'feeGrowthInside0LastX128' : bigint,
  'nonce' : bigint,
  'token0Amount' : bigint,
  'token1Amount' : bigint,
  'tickLower' : bigint,
  'poolId' : bigint,
}
export interface PushError { 'time' : bigint, 'message' : string }
export interface QueryPositionResult {
  'fee' : bigint,
  'tickUpper' : bigint,
  'tokensOwed0' : bigint,
  'tokensOwed1' : bigint,
  'operator' : Address__1,
  'feeGrowthInside1LastX128' : bigint,
  'liquidity' : bigint,
  'feeGrowthInside0LastX128' : bigint,
  'token0' : Address__1,
  'token1' : Address__1,
  'nonce' : bigint,
  'tickLower' : bigint,
  'poolId' : bigint,
}
export type ResponseResult = { 'ok' : string } |
  { 'err' : string };
export type ResponseResult_1 = { 'ok' : ResultAmount } |
  { 'err' : string };
export type ResponseResult_10 = { 'ok' : Array<string> } |
  { 'err' : string };
export type ResponseResult_2 = { 'ok' : QueryPositionResult } |
  { 'err' : string };
export type ResponseResult_3 = { 'ok' : Array<bigint> } |
  { 'err' : string };
export type ResponseResult_4 = { 'ok' : MintResult } |
  { 'err' : string };
export type ResponseResult_5 = { 'ok' : LiquidityType } |
  { 'err' : string };
export type ResponseResult_6 = { 'ok' : VolumeMapType } |
  { 'err' : string };
export type ResponseResult_7 = { 'ok' : Array<TickLiquidityInfo> } |
  { 'err' : string };
export type ResponseResult_8 = { 'ok' : Array<TVLResult> } |
  { 'err' : string };
export type ResponseResult_9 = { 'ok' : Address } |
  { 'err' : string };
export interface ResultAmount { 'amount0' : bigint, 'amount1' : bigint }
export interface SwapRecordInfo {
  'to' : string,
  'feeAmount' : bigint,
  'action' : TransactionType,
  'feeAmountTotal' : bigint,
  'token0Id' : Address__1,
  'token1Id' : Address__1,
  'token0AmountTotal' : bigint,
  'liquidityTotal' : bigint,
  'from' : string,
  'tick' : bigint,
  'feeTire' : bigint,
  'recipient' : string,
  'token0ChangeAmount' : bigint,
  'token1AmountTotal' : bigint,
  'liquidityChange' : bigint,
  'token1Standard' : string,
  'TVLToken0' : bigint,
  'TVLToken1' : bigint,
  'token0Fee' : bigint,
  'token1Fee' : bigint,
  'timestamp' : bigint,
  'token1ChangeAmount' : bigint,
  'token0Standard' : string,
  'price' : bigint,
  'poolId' : string,
}
export interface TVLResult { 'token0TVL' : bigint, 'token1TVL' : bigint }
export interface TickLiquidityInfo {
  'tickIndex' : bigint,
  'price0Decimal' : bigint,
  'liquidityNet' : bigint,
  'price0' : bigint,
  'price1' : bigint,
  'liquidityGross' : bigint,
  'price1Decimal' : bigint,
}
export type TransactionType = { 'fee' : null } |
  { 'burn' : null } |
  { 'claim' : null } |
  { 'mint' : null } |
  { 'swap' : null } |
  { 'addLiquidity' : null } |
  { 'removeLiquidity' : null } |
  { 'refreshIncome' : null } |
  { 'transfer' : null } |
  { 'collect' : null };
export interface TxStorageCanisterResponse {
  'errors' : Array<PushError>,
  'retryCount' : bigint,
  'canisterId' : string,
}
export interface VolumeMapType { 'tokenA' : bigint, 'tokenB' : bigint }
export interface _SERVICE {
  'addAdmin' : ActorMethod<[string], BoolResult__1>,
  'addTokenId' : ActorMethod<[Address, bigint], undefined>,
  'burn' : ActorMethod<[bigint], ResponseResult_1>,
  'clearTxStorageErrors' : ActorMethod<[], bigint>,
  'collect' : ActorMethod<[CollectParams], ResponseResult_1>,
  'collectInInvalidPosition' : ActorMethod<[CollectParams], ResponseResult_1>,
  'createAndInitializePoolIfNecessary' : ActorMethod<
    [Address, string, Address, string, bigint, string],
    ResponseResult_9,
  >,
  'cycleAvailable' : ActorMethod<[], NatResult>,
  'cycleBalance' : ActorMethod<[], NatResult>,
  'decreaseLiquidity' : ActorMethod<
    [DecreaseLiquidityParams],
    ResponseResult_1,
  >,
  'decreaseLiquidityInInvalidPosition' : ActorMethod<
    [DecreaseLiquidityParams],
    ResponseResult_1,
  >,
  'fixOperator' : ActorMethod<[bigint, Address], undefined>,
  'getAdminList' : ActorMethod<[], ResponseResult_10>,
  'getApproved' : ActorMethod<[bigint], ResponseResult_9>,
  'getBaseDataStructureCanister' : ActorMethod<[string], string>,
  'getCachedSwapRecord' : ActorMethod<[], Array<SwapRecordInfo>>,
  'getIntervalTime' : ActorMethod<[], bigint>,
  'getMaxRetrys' : ActorMethod<[], bigint>,
  'getPoolTVL' : ActorMethod<[Array<PoolKey>], ResponseResult_8>,
  'getPositionByPoolAddress' : ActorMethod<
    [Address, bigint, bigint],
    Array<PositionWithTokenAmount>,
  >,
  'getPositionTotalLiquidityByPoolAddress' : ActorMethod<[Address], bigint>,
  'getTickInfos' : ActorMethod<[string], ResponseResult_7>,
  'getTotalVolume' : ActorMethod<[string], ResponseResult_6>,
  'getTxStorage' : ActorMethod<[], [] | [TxStorageCanisterResponse]>,
  'increaseLiquidity' : ActorMethod<
    [IncreaseLiquidityParams],
    ResponseResult_5,
  >,
  'invalidPositions' : ActorMethod<[bigint], ResponseResult_2>,
  'isTxStorageAvailable' : ActorMethod<[], boolean>,
  'mint' : ActorMethod<[MintParams], ResponseResult_4>,
  'ownerInvalidTokens' : ActorMethod<[string], ResponseResult_3>,
  'ownerTokens' : ActorMethod<[string], ResponseResult_3>,
  'positions' : ActorMethod<[bigint], ResponseResult_2>,
  'recoverTxStorage' : ActorMethod<[], bigint>,
  'refreshIncome' : ActorMethod<[bigint], ResponseResult_1>,
  'refreshInvalidIncome' : ActorMethod<[bigint], ResponseResult_1>,
  'removeAdmin' : ActorMethod<[string], BoolResult__1>,
  'removeSwapPool' : ActorMethod<[Address], BoolResult>,
  'removeTokenId' : ActorMethod<[Address, bigint], undefined>,
  'removeTxStorage' : ActorMethod<[], undefined>,
  'setAvailable' : ActorMethod<[boolean], undefined>,
  'setBaseDataStructureCanister' : ActorMethod<[string], undefined>,
  'setIntervalTime' : ActorMethod<[bigint], undefined>,
  'setLockServerCanisterId' : ActorMethod<[string], undefined>,
  'setMaxRetrys' : ActorMethod<[bigint], undefined>,
  'setSwapNFTCanisterId' : ActorMethod<[string], undefined>,
  'setTxStorage' : ActorMethod<[[] | [string]], bigint>,
  'swapNFTCanisterId' : ActorMethod<[], string>,
  'tokenURI' : ActorMethod<[bigint], ResponseResult>,
  'transfer' : ActorMethod<[bigint, string], ResponseResult>,
}
