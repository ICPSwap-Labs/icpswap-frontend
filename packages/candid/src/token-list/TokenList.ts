import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export type BoolResult = { ok: boolean } | { err: string };
export interface Config {
  value: string;
  name: string;
}
export interface Media {
  link: string;
  mediaType: string;
}
export type NatResult = { ok: bigint } | { err: string };
export type Result = { ok: string } | { err: string };
export type Result_1 = { ok: Array<TokenMetadata> } | { err: string };
export type Result_2 = { ok: Array<string> } | { err: string };
export type Result_3 = { ok: [] | [TokenMetadata] } | { err: string };
export interface TokenMetadata {
  fee: bigint;
  configs: Array<Config>;
  decimals: bigint;
  name: string;
  rank: number;
  mediaLinks: Array<Media>;
  totalSupply: bigint;
  introduction: string;
  standard: string;
  symbol: string;
  canisterId: string;
}
export interface _SERVICE {
  add: ActorMethod<[TokenMetadata], BoolResult>;
  addAdmin: ActorMethod<[string], BoolResult>;
  cycleAvailable: ActorMethod<[], NatResult>;
  cycleBalance: ActorMethod<[], NatResult>;
  edit: ActorMethod<[string, TokenMetadata], BoolResult>;
  get: ActorMethod<[string], Result_3>;
  getAdminList: ActorMethod<[], Result_2>;
  getList: ActorMethod<[], Result_1>;
  getLogo: ActorMethod<[string], Result>;
  remove: ActorMethod<[string], BoolResult>;
  removeAdmin: ActorMethod<[string], BoolResult>;
  updateLogo: ActorMethod<[string, string], BoolResult>;
}
