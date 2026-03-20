import type { ActorMethod } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";

export type NatResult__2 = { ok: bigint } | { err: string };
export interface TvlChartDayData {
  id: bigint;
  tvlUSD: number;
  timestamp: bigint;
}
export interface _SERVICE {
  addOwners: ActorMethod<[Array<Principal>], undefined>;
  cycleAvailable: ActorMethod<[], NatResult__2>;
  cycleBalance: ActorMethod<[], NatResult__2>;
  getOwners: ActorMethod<[], Array<Principal>>;
  getPoolChartTvl: ActorMethod<[string, bigint, bigint], Array<TvlChartDayData>>;
  getTokenChartTvl: ActorMethod<[string, bigint, bigint], Array<TvlChartDayData>>;
  insert: ActorMethod<[Array<[string, TvlChartDayData]>, Array<[string, TvlChartDayData]>], bigint>;
}
