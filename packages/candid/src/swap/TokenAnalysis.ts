import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface Page {
  content: Array<TokenDataIndex>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export type Result = { ok: Page } | { err: string };
export type Result_1 = { ok: TokenDataIndex } | { err: string };
export type Result_2 = { ok: Array<Principal> } | { err: string };
export interface TokenDataIndex {
  marketAmount: number;
  decimals: bigint;
  ledgerId: Principal;
  standards: string;
  name: string;
  transactionAmount: bigint;
  holders: bigint;
  symbol: string;
  lockedAmount: number;
}
export interface UploadRequests {
  tokenDatas: Array<TokenDataIndex>;
}
export interface _SERVICE {
  cycleBalance: ActorMethod<[], bigint>;
  getAdmins: ActorMethod<[], Result_2>;
  getTokenData: ActorMethod<[Principal], Result_1>;
  getUSDPrice: ActorMethod<[Principal], number>;
  queryTokenDatas: ActorMethod<[bigint, bigint], Result>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  uploadTokenData: ActorMethod<[UploadRequests], boolean>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
