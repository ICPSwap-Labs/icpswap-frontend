import type { ActorMethod } from "@icpswap/dfinity";
import type { IDL } from "@icpswap/dfinity";

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
