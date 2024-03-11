import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type NatResult__1 = { 'ok' : bigint } |
  { 'err' : string };
export interface PublicSwapChartDayData {
  'id' : bigint,
  'volumeUSD' : number,
  'feesUSD' : number,
  'tvlUSD' : number,
  'timestamp' : bigint,
  'txCount' : bigint,
}
export interface _SERVICE {
  'addOwners' : ActorMethod<[Array<Principal>], undefined>,
  'cycleAvailable' : ActorMethod<[], NatResult__1>,
  'cycleBalance' : ActorMethod<[], NatResult__1>,
  'getChartData' : ActorMethod<[], Array<PublicSwapChartDayData>>,
  'getOwners' : ActorMethod<[], Array<Principal>>,
  'insert' : ActorMethod<[PublicSwapChartDayData], undefined>,
}