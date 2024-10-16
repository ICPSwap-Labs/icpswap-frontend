import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface ICPSwapPoolDataIndex {
  low: number;
  snapshotTime: bigint;
  volumeToken0: number;
  volumeToken1: number;
  sqrtPrice: number;
  high: number;
  close: number;
  open: number;
  token1Price: number;
  volumeUSD: number;
  feesUSD: number;
  tvlUSD: number;
  token0LockedAmount: number;
  txCount: bigint;
  token1LedgerId: string;
  dayId: bigint;
  token0LedgerId: string;
  token1LockedAmount: number;
  token0Price: number;
  poolId: string;
}
export interface Page {
  content: Array<PriceIndex>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_1 {
  content: Array<PositionIndex>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_2 {
  content: Array<ICPSwapPoolDataIndex>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface PoolAprIndex {
  aprAvg1D: number;
  aprAvg7D: number;
  pool: Principal;
  aprAvg30D: number;
}
export interface PositionIndex {
  accountId: string;
  aprAvg7D: number;
  feesAvg24H: number;
  feesAvg30D: number;
  pool: Principal;
  positionId: bigint;
  aprAvg24H: number;
  aprAvg30D: number;
  feesAvg7D: number;
  valueAvg7D: number;
  valueAvg24H: number;
  valueAvg30D: number;
}
export interface PriceIndex {
  priceLow7D: number;
  pool: Principal;
  priceHigh24H: number;
  priceHigh30D: number;
  priceHigh7D: number;
  priceLow24H: number;
  priceLow30D: number;
}
export type Result = { ok: Page } | { err: string };
export type Result_1 = { ok: Page_1 } | { err: string };
export type Result_2 = { ok: Page_2 } | { err: string };
export type Result_3 = { ok: PriceIndex } | { err: string };
export type Result_4 = { ok: PositionIndex } | { err: string };
export type Result_5 = { ok: PoolAprIndex } | { err: string };
export type Result_6 = { ok: Array<Principal> } | { err: string };
export interface UploadPositionRequests {
  positionIndexs: Array<PositionIndex>;
}
export interface UploadPriceRequests {
  priceIndexs: Array<PriceIndex>;
}
export interface _SERVICE {
  cycleBalance: ActorMethod<[], bigint>;
  getAdmins: ActorMethod<[], Result_6>;
  getPoolAprIndex: ActorMethod<[Principal], Result_5>;
  getPositionIndex: ActorMethod<[Principal, bigint], Result_4>;
  getPriceIndex: ActorMethod<[Principal], Result_3>;
  getTaskState: ActorMethod<[], boolean>;
  queryPoolDataIndexPage: ActorMethod<[bigint, bigint], Result_2>;
  queryPositionIndexPage: ActorMethod<[[] | [Principal], bigint, bigint], Result_1>;
  queryPriceIndexPage: ActorMethod<[bigint, bigint], Result>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  setTaskState: ActorMethod<[boolean], boolean>;
  uploadPositionIndex: ActorMethod<[UploadPositionRequests], boolean>;
  uploadPriceIndex: ActorMethod<[UploadPriceRequests], boolean>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
