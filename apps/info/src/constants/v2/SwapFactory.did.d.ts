import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Address = string;
export type Int24 = bigint;
export interface Page {
  'content' : Array<PoolInfo>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Pool {
  'fee' : bigint,
  'ticks' : Array<bigint>,
  'liquidity' : bigint,
  'tickCurrent' : bigint,
  'token0' : string,
  'token1' : string,
  'sqrtRatioX96' : bigint,
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
export type PrincipalText = string;
export type TextResult = { 'ok' : string } |
  { 'err' : string };
export interface TradeOverview {
  'tvl' : bigint,
  'tradeUserNum' : bigint,
  'volume' : bigint,
  'tradeSymbolNum' : bigint,
}
export type Uint24 = bigint;
export interface _SERVICE {
  '_getPool' : ActorMethod<[string], Pool>,
  'addAdmin' : ActorMethod<[string], boolean>,
  'createPool' : ActorMethod<
    [Address, string, Address, string, bigint],
    PrincipalText,
  >,
  'cycleAvailable' : ActorMethod<[], bigint>,
  'cycleBalance' : ActorMethod<[], bigint>,
  'enableFeeAmount' : ActorMethod<[Uint24, Int24], TextResult>,
  'getAdminList' : ActorMethod<[], Array<string>>,
  'getInvalidPool' : ActorMethod<[string], PrincipalText>,
  'getOverview' : ActorMethod<[], TradeOverview>,
  'getPool' : ActorMethod<[string], PrincipalText>,
  'getPoolIds' : ActorMethod<[], Array<string>>,
  'getPoolList' : ActorMethod<[], Array<PoolInfo>>,
  'getPoolListByPage' : ActorMethod<[bigint, bigint], Page>,
  'getPools' : ActorMethod<[Array<string>], Array<Pool>>,
  'removeAdmin' : ActorMethod<[string], boolean>,
  'removePool' : ActorMethod<[Address], undefined>,
  'setBaseDataStructureCanister' : ActorMethod<[string], undefined>,
}
