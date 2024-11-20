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
  content: Array<PositionDataIndex>;
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
export interface PositionDataIndex {
  apr: number;
  snapshotTime: bigint;
  token0FeeAmount: bigint;
  value: number;
  token1FeeDayAmount: bigint;
  fees: number;
  pool: Principal;
  positionId: bigint;
  token0Amount: bigint;
  token1USDPrice: number;
  dayId: bigint;
  token1Amount: bigint;
  token1FeeAmount: bigint;
  token0FeeDayAmount: bigint;
  token0USDPrice: number;
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
export type Result_1 =
  | {
      ok: Array<{
        snapshotTime: bigint;
        value: number;
        positionId: bigint;
        dayId: bigint;
        poolId: Principal;
      }>;
    }
  | { err: string };
export type Result_10 = { ok: PoolAprIndex } | { err: string };
export type Result_11 = { ok: Array<Principal> } | { err: string };
export type Result_2 =
  | {
      ok: Array<{
        snapshotTime: bigint;
        fees: number;
        positionId: bigint;
        dayId: bigint;
        poolId: Principal;
      }>;
    }
  | { err: string };
export type Result_3 = { ok: Page_1 } | { err: string };
export type Result_4 =
  | {
      ok: Array<{
        apr: number;
        snapshotTime: bigint;
        positionId: bigint;
        dayId: bigint;
        poolId: Principal;
      }>;
    }
  | { err: string };
export type Result_5 =
  | {
      ok: Array<{
        snapshotTime: bigint;
        price: number;
        hourId: bigint;
        dayId: bigint;
        poolId: Principal;
      }>;
    }
  | { err: string };
export type Result_6 = { ok: Page_2 } | { err: string };
export type Result_7 =
  | {
      ok: Array<{
        apr: number;
        snapshotTime: bigint;
        dayId: bigint;
        poolId: string;
      }>;
    }
  | { err: string };
export type Result_8 = { ok: PriceIndex } | { err: string };
export type Result_9 = { ok: Array<PositionDataIndex> } | { err: string };
export interface TaskPositionStatus {
  lastSyncDay4Position: bigint;
  syncErrorMsgs: Array<string>;
  syncPoolSize: bigint;
  taskStatus: boolean;
  currentSyncPool: string;
  pendingSyncPoolSize: bigint;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  currentPoolPositionSize: bigint;
  currentDay: bigint;
  syncPositionDataLock: boolean;
  nowTime: bigint;
}
export interface TaskPriceStatus {
  syncErrorMsgs: Array<string>;
  syncPoolSize: bigint;
  taskStatus: boolean;
  currentSyncPool: string;
  pendingSyncPoolSize: bigint;
  currentHour: bigint;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  lastSyncHour4PoolPrice: bigint;
  currentDay: bigint;
  syncPoolPriceLock: boolean;
  nowTime: bigint;
}
export interface TaskStatus {
  lastSyncDay4Position: bigint;
  lastSyncDay4PoolData: bigint;
  totalPoolSize: bigint;
  taskStatus: boolean;
  currentHour: bigint;
  syncPoolDataLock: boolean;
  pendingSyncPriceSize: bigint;
  totalTokenListSize: bigint;
  lastSyncHour4PoolPrice: bigint;
  currentDay: bigint;
  pendingSyncPoolDataSize: bigint;
  syncPositionDataLock: boolean;
  pendingSyncPositionSize: bigint;
  syncPoolPriceLock: boolean;
  nowTime: bigint;
}
export interface _SERVICE {
  cycleBalance: ActorMethod<[], bigint>;
  getAdmins: ActorMethod<[], Result_11>;
  getPoolAprIndex: ActorMethod<[Principal], Result_10>;
  getPositionIndexs: ActorMethod<[Principal, bigint], Result_9>;
  getPriceIndex: ActorMethod<[Principal], Result_8>;
  getStat: ActorMethod<[], TaskPositionStatus>;
  getStatPrice: ActorMethod<[], TaskPriceStatus>;
  getStatus: ActorMethod<[], TaskStatus>;
  getTaskState: ActorMethod<[], boolean>;
  queryPoolAprLine: ActorMethod<[Principal], Result_7>;
  queryPoolDataIndexPage: ActorMethod<[bigint, bigint], Result_6>;
  queryPoolPriceLine: ActorMethod<[Principal], Result_5>;
  queryPositionAprLine: ActorMethod<[Principal, bigint], Result_4>;
  queryPositionDataIndexPage: ActorMethod<[[] | [string], bigint, bigint], Result_3>;
  queryPositionFeesLine: ActorMethod<[Principal, bigint], Result_2>;
  queryPositionValueLine: ActorMethod<[Principal, bigint], Result_1>;
  queryPriceIndexPage: ActorMethod<[bigint, bigint], Result>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  setTaskState: ActorMethod<[boolean], boolean>;
  syncPoolAndTokenList: ActorMethod<[], undefined>;
  syncPoolPriceData: ActorMethod<[], undefined>;
  syncPositionData: ActorMethod<[], undefined>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
