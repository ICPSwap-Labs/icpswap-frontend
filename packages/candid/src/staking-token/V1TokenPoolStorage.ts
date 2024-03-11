import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Page {
  'content' : Array<Record>,
  'offset' : bigint,
  'limit' : bigint,
  'totalElements' : bigint,
}
export interface Record {
  'to' : string,
  'stakingTokenSymbol' : string,
  'rewardTokenSymbol' : string,
  'tokenId' : [] | [bigint],
  'incentiveCanisterId' : string,
  'stakingToken' : string,
  'rewardToken' : string,
  'stakingStandard' : string,
  'transType' : TransType,
  'from' : string,
  'pool' : [] | [string],
  'recipient' : string,
  'rewardStandard' : string,
  'timestamp' : bigint,
  'stakingTokenDecimals' : bigint,
  'amount' : bigint,
  'rewardTokenDecimals' : bigint,
}
export type ResponseResult = { 'ok' : Page } |
  { 'err' : string };
export interface SwapStakerStorage {
  'getRewardTrans' : ActorMethod<[bigint, bigint], ResponseResult>,
  'getTrans' : ActorMethod<[bigint, bigint], ResponseResult>,
  'save' : ActorMethod<[Record], undefined>,
  'setSwapStakerCanister' : ActorMethod<[string], undefined>,
}
export type TransType = { 'withdraw' : null } |
  { 'unstaking' : null } |
  { 'staking' : null } |
  { 'endIncentive' : null } |
  { 'claim' : null } |
  { 'unstakeTokenids' : null } |
  { 'deposit' : null } |
  { 'stakeTokenids' : null } |
  { 'createIncentive' : null };
export interface _SERVICE extends SwapStakerStorage {}
