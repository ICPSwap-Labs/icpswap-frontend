import type { ActorMethod } from "@icp-sdk/core/agent";
import type { IDL } from "@icp-sdk/core/candid";
import type { Principal } from "@icp-sdk/core/principal";

export interface AliasResult {
  is_public: boolean;
  alias: [] | [string];
  governance_id: [] | [Principal];
  ledger_id: Principal;
}
export interface Page {
  content: Array<[Principal, string]>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export type Result = { ok: boolean } | { err: string };
export type Result_1 = { ok: Page } | { err: string };
export type Result_2 = { ok: Array<Principal> } | { err: string };
export interface _SERVICE {
  addPrincipalAlias: ActorMethod<[Principal, string], Result>;
  addSharedPrincipal: ActorMethod<[Principal], Result>;
  cycleBalance: ActorMethod<[], bigint>;
  getAdmins: ActorMethod<[], Result_2>;
  getAllPrincipalAliases: ActorMethod<[], Array<[Principal, string]>>;
  getPrincipalAlias: ActorMethod<[Principal], [] | [string]>;
  getPrincipalAliasByLedger: ActorMethod<[Principal], Array<[Principal, string]>>;
  getPrincipalAliasByLedgers: ActorMethod<[Array<Principal>], Array<AliasResult>>;
  queryPrincipalAliasPage: ActorMethod<[bigint, bigint], Result_1>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  syncSNSProject: ActorMethod<[], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
