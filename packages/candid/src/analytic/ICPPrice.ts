import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type NatResult = { 'ok' : bigint } |
  { 'err' : string };
export interface WICPType {
  'icpswap' : { 'decimals' : bigint, 'address' : string },
  'sonic' : { 'decimals' : bigint, 'address' : string },
}
export interface _SERVICE {
  'addAdmin' : ActorMethod<[string], boolean>,
  'cycleAvailable' : ActorMethod<[], NatResult>,
  'cycleBalance' : ActorMethod<[], NatResult>,
  'getAdminList' : ActorMethod<[], Array<string>>,
  'getICP_XDR_Price' : ActorMethod<[], number>,
  'getIcpPrice' : ActorMethod<[bigint], number>,
  'getWicp' : ActorMethod<[], WICPType>,
  'getWicpPrice' : ActorMethod<[], number>,
  'getWicps' : ActorMethod<[], Array<string>>,
  'isAdmin' : ActorMethod<[string], boolean>,
  'removeAdmin' : ActorMethod<[string], boolean>,
  'setICPXDRRate' : ActorMethod<[number], undefined>,
  'setWICP' : ActorMethod<[string, string], undefined>,
  'setWicpPrice' : ActorMethod<[number], undefined>,
}
