import { FarmInfoWithId, Override, UserPositionInfo, UserPositionInfoWithId } from "@icpswap/types";

export type PositionDetail = {
  pool: string;
  token0: string;
  token1: string;
  fee: string;
  tickUpper: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
  feeGrowthInside1LastX128: bigint;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  tickLower: bigint;
  positionId: string;
};

export type UserPositionByList = {
  position: UserPositionInfoWithId;
  poolId: string;
};

export type UserPositionForFarm = {
  position: UserPositionInfo;
  poolId: string;
  farm: FarmInfoWithId;
  positionId: bigint;
};

export type UserPosition = Override<
  UserPositionInfo,
  { index: number; id: string; token0: string; token1: string; fee: string }
>;

export enum PositionFilterState {
  Default = "Default",
  All = "All",
  InRanges = "In ranges",
  OutOfRanges = "Out of ranges",
  Closed = "Closed",
}

export enum PositionSort {
  Default = "Default",
  PositionValue = "Position value",
  FeesValue = "Uncollected fees",
}

export type PositionKey = string;

export type PositionDetails = Override<UserPositionInfoWithId, { poolId: string }>;

export enum PoolState {
  LOADING = "LOADING",
  NOT_EXISTS = "NOT_EXISTS",
  EXISTS = "EXISTS",
  INVALID = "INVALID",
  NOT_CHECK = "NOT_CHECK",
}
