import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface AddAlert {
  alertType: AlertType;
  repeated: boolean;
  alertValue: number;
  tokenId: string;
  email: string;
}
export interface AlertInfo {
  id: bigint;
  alertType: AlertType;
  repeated: boolean;
  alertValue: number;
  tokenId: string;
  metadata: Array<Value>;
  createdAt: bigint;
  user: Principal;
  email: string;
}
export type AlertType =
  | { PriceIncrease: null }
  | { MarginOfDecrease24H: null }
  | { MarginOfIncrease24H: null }
  | { PriceDecrease: null };
export type Error =
  | { NotController: null }
  | { CommonError: null }
  | { InvalidRequest: string }
  | { InternalError: string };
export interface Page {
  content: Array<AlertInfo>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export type Result = { ok: Page } | { err: Error };
export type Result_1 = { ok: null } | { err: Error };
export type Value =
  | { Int: bigint }
  | { Map: Array<[string, Value]> }
  | { Nat: bigint }
  | { Blob: Uint8Array | number[] }
  | { Bool: boolean }
  | { Text: string }
  | { Float: number }
  | { Principal: Principal }
  | { Array: Array<Value> };
export interface _SERVICE {
  add_alert: ActorMethod<[AddAlert], Result_1>;
  delete_alert: ActorMethod<[bigint], Result_1>;
  get_alerts: ActorMethod<[bigint, bigint], Result>;
  get_deleted_alerts: ActorMethod<[bigint, bigint], Array<bigint>>;
  get_user_alerts: ActorMethod<[], Array<AlertInfo>>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
