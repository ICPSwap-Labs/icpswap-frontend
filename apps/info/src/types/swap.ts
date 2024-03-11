import { Override, UserPositionInfoWithId } from "@icpswap/types";

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

export type UserPosition = Override<UserPositionInfoWithId, { poolId: string }>;
