import { Override, UserPositionInfo } from "@icpswap/types";

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

export type UserPosition = Override<
  UserPositionInfo,
  { index: number; id: string; token0: string; token1: string; fee: string }
>;
