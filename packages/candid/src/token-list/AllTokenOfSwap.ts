import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface Account {
  owner: Principal;
  subaccount: [] | [Subaccount];
}
export interface Page {
  content: Array<TokenInfo>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export type Result = { ok: boolean } | { err: string };
export type Result_1 = { ok: Page } | { err: string };
export type Result_2 = { ok: string } | { err: string };
export type Subaccount = Uint8Array | number[];
export interface TokenInfo {
  fee: bigint;
  decimals: bigint;
  minting_account: [] | [Account];
  logo: [] | [string];
  name: string;
  ledger_id: Principal;
  min_burn_amount: bigint;
  max_supply: [] | [bigint];
  index: bigint;
  standard: string;
  total_supply: bigint;
  symbol: string;
}
export interface _SERVICE {
  get_logo: ActorMethod<[Principal], Result_2>;
  get_task_state: ActorMethod<[], Result>;
  get_token_list: ActorMethod<[bigint, bigint, [] | [boolean]], Result_1>;
  set_task_state: ActorMethod<[boolean], Result>;
  set_token_index: ActorMethod<[Principal, bigint], Result>;
  set_token_logo: ActorMethod<[Principal, string], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
