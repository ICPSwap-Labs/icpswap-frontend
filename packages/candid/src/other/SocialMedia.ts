import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface ICSNews {
  title: string;
  content: string;
  created_at: bigint;
}
export interface _SERVICE {
  get_news: ActorMethod<[string, bigint, bigint], Array<ICSNews>>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
