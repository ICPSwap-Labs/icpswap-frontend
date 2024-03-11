import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export type BoolResult = { ok: boolean } | { err: string };
export interface CanisterInfo {
  topupTotal: bigint;
  canisterName: [] | [string];
  canisterType: [] | [string];
  cycleBalance: bigint;
  canisterReturnMode: [] | [string];
  canisterId: Principal;
}
export interface CanisterStatInfo {
  topupTotal: bigint;
  canisterSize: bigint;
  cycleBalance: bigint;
  canisterId: Principal;
}
export interface CycleScanRecord {
  scanTime: bigint;
  canisterName: string;
  canisterType: string;
  cycleBalance: bigint;
  canisterId: Principal;
}
export interface CycleTopupRecord {
  topupTime: bigint;
  canisterName: string;
  canisterType: string;
  topupCycleAmount: bigint;
  canisterId: Principal;
}
export type NatResult = { ok: bigint } | { err: string };
export interface Page {
  content: Array<CanisterInfo>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_1 {
  content: Array<CycleTopupRecord>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_2 {
  content: Array<CycleScanRecord>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_3 {
  content: Array<[Principal, bigint]>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export type ResponseResult = { ok: CanisterStatInfo } | { err: string };
export type ResponseResult_1 = { ok: Array<string> } | { err: string };
export type ResponseResult_2 = { ok: CanisterInfo } | { err: string };
export type ResponseResult_3 = { ok: Page } | { err: string };
export type ResponseResult_4 = { ok: Page_1 } | { err: string };
export type ResponseResult_5 = { ok: Page_2 } | { err: string };
export type ResponseResult_6 = { ok: Page_3 } | { err: string };
export type ResponseResult_7 = { ok: Array<Principal> } | { err: string };
export interface _SERVICE {
  add: ActorMethod<[Principal, [] | [string], [] | [string], [] | [string]], BoolResult>;
  addAdmin: ActorMethod<[string], BoolResult>;
  addBalckList: ActorMethod<[Principal], BoolResult>;
  cycleAvailable: ActorMethod<[], NatResult>;
  cycleBalance: ActorMethod<[], NatResult>;
  cycleScan: ActorMethod<[], BoolResult>;
  cycleTopup: ActorMethod<[], BoolResult>;
  delete: ActorMethod<[Principal], BoolResult>;
  deletePending: ActorMethod<[Principal], BoolResult>;
  findBalckList: ActorMethod<[], ResponseResult_7>;
  findPage: ActorMethod<[[] | [string], [] | [string], bigint, bigint], ResponseResult_3>;
  findPendingPage: ActorMethod<[bigint, bigint], ResponseResult_6>;
  findScanRecordPage: ActorMethod<[[] | [string], [] | [string], bigint, bigint], ResponseResult_5>;
  findTopupRecordPage: ActorMethod<[[] | [string], [] | [string], bigint, bigint], ResponseResult_4>;
  findZeroPage: ActorMethod<[[] | [string], [] | [string], bigint, bigint], ResponseResult_3>;
  get: ActorMethod<[Principal], ResponseResult_2>;
  getAdminList: ActorMethod<[], ResponseResult_1>;
  getStat: ActorMethod<[], ResponseResult>;
  getTaskState: ActorMethod<[], BoolResult>;
  importCanister: ActorMethod<[], BoolResult>;
  registerTask: ActorMethod<[], BoolResult>;
  removeAdmin: ActorMethod<[string], BoolResult>;
  removeBalckList: ActorMethod<[Principal], BoolResult>;
  setTaskState: ActorMethod<[boolean], BoolResult>;
  task: ActorMethod<[string], undefined>;
}
