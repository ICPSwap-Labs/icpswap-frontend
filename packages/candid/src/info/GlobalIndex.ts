import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface PublicProtocolData {
  'volumeUSD' : number,
  'feesUSD' : number,
  'tvlUSD' : number,
  'txCount' : bigint,
}
export interface TvlOverview { 'tvlUSD' : number, 'tvlUSDChange' : number }
export interface _SERVICE {
  'addOwner' : ActorMethod<[Principal], undefined>,
  'cycleAvailable' : ActorMethod<[], NatResult>,
  'cycleBalance' : ActorMethod<[], NatResult>,
  'getAllPoolTvl' : ActorMethod<[], Array<[string, number]>>,
  'getAllTokenTvl' : ActorMethod<[], Array<[string, number]>>,
  'getAllowTokens' : ActorMethod<[], Array<string>>,
  'getOwners' : ActorMethod<[], Array<Principal>>,
  'getPoolLastTvl' : ActorMethod<[string], TvlOverview>,
  'getProtocolData' : ActorMethod<[], PublicProtocolData>,
  'getSyncError' : ActorMethod<[], string>,
  'getSyncState' : ActorMethod<[], boolean>,
  'getSyncTime' : ActorMethod<[], bigint>,
  'getTokenLastTvl' : ActorMethod<[string], TvlOverview>,
  'getTvlSyncState' : ActorMethod<[], boolean>,
  'globalLastStorageCanister' : ActorMethod<[], string>,
  'globalStorageCanister' : ActorMethod<[], Array<string>>,
  'syncGlobal' : ActorMethod<[], undefined>,
  'syncTvl' : ActorMethod<[], undefined>,
  'syncTvlStatus' : ActorMethod<[], boolean>,
  'tvlLastStorageCanister' : ActorMethod<[], string>,
  'tvlStorageCanister' : ActorMethod<[], Array<string>>,
}