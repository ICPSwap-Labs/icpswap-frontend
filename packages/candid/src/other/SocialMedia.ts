import type { ActorMethod } from "@icp-sdk/core/agent";
import type { IDL } from "@icp-sdk/core/candid";

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
