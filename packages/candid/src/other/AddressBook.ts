import type { ActorMethod } from "@icp-sdk/core/agent";
import type { IDL } from "@icp-sdk/core/candid";

export interface AddressBook {
  id: bigint;
  name: string;
  network: NetworkType;
  address: string;
}
export type NetworkType = { IC: null };
export type Result = { ok: { balance: bigint; available: bigint } } | { err: string };
export interface _SERVICE {
  copy: ActorMethod<[bigint], [] | [AddressBook]>;
  create: ActorMethod<[NetworkType, string, string], undefined>;
  get: ActorMethod<[], Array<AddressBook>>;
  get_cycle_info: ActorMethod<[], Result>;
  remove: ActorMethod<[bigint], undefined>;
  update: ActorMethod<[bigint, NetworkType, string, string], undefined>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
