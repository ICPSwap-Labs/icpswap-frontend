import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface Page {
  content: Array<UserWalletInfo>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export type Result = { ok: Page } | { err: string };
export type Result_1 = { ok: WalletBalance } | { err: string };
export type Result_2 = { ok: Array<Principal> } | { err: string };
export interface TokenBalance {
  token: Principal;
  balance: number;
}
export interface UploadRequests {
  userWallets: Array<UserWallet>;
}
export interface UserWallet {
  user: Principal;
  tokens: Array<TokenBalance>;
}
export interface UserWalletInfo {
  user: string;
  tokens: Array<TokenBalance>;
}
export interface WalletBalance {
  user: Principal;
  tokens: Array<TokenBalance>;
  totalBalance: number;
}
export interface _SERVICE {
  cycleBalance: ActorMethod<[], bigint>;
  getAdmins: ActorMethod<[], Result_2>;
  getUSDPrice: ActorMethod<[Principal], number>;
  getUserTokens: ActorMethod<[Principal], Result_1>;
  queryUserTokens: ActorMethod<[bigint, bigint], Result>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  uploadUserWallet: ActorMethod<[UploadRequests], boolean>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
