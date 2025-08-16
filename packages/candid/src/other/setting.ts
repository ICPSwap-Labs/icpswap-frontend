import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface AdsPage {
  url: string;
  content: string;
  button_name: string;
}
export type ChartType =
  | { TVl: null }
  | { DexTools: null }
  | { Volume: null }
  | { Dexscreener: null }
  | { Token0: null }
  | { Token1: null }
  | { Liquidity: null };
export interface GlobalNotice {
  url: string;
  content: string;
}
export type Result = { ok: { balance: bigint; available: bigint } } | { err: string };
export interface _SERVICE {
  add_controller: ActorMethod<[Principal], undefined>;
  add_default_token: ActorMethod<[Principal], undefined>;
  add_maintenance_page: ActorMethod<[string, string], undefined>;
  get_active_maintenance_pages: ActorMethod<[], Array<[string, string]>>;
  get_ads_page: ActorMethod<[], [] | [AdsPage]>;
  get_controllers: ActorMethod<[], Array<Principal>>;
  get_cycle_info: ActorMethod<[], Result>;
  get_default_chart_type: ActorMethod<[], ChartType>;
  get_default_tokens: ActorMethod<[], Array<Principal>>;
  get_global_notice: ActorMethod<[], [] | [GlobalNotice]>;
  get_maintenance_pages: ActorMethod<[], Array<[string, string]>>;
  remove_controller: ActorMethod<[Principal], undefined>;
  remove_default_token: ActorMethod<[Principal], undefined>;
  remove_maintenance_page: ActorMethod<[string], undefined>;
  set_ads_page: ActorMethod<[AdsPage], undefined>;
  set_default_chart_type: ActorMethod<[ChartType], undefined>;
  set_global_notice: ActorMethod<[string, string], undefined>;
  update_maintenance_page_status: ActorMethod<[string, boolean], undefined>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
