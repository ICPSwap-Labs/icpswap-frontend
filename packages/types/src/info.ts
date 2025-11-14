import type { PublicPoolOverView } from "@icpswap/candid";
import type { Override } from "./global";

export type {
  PublicProtocolData,
  TvlChartDayData,
  PublicSwapChartDayData,
  BaseTransaction,
  PublicPoolOverView,
  PublicTokenOverview,
  PoolOverview,
  PublicPoolChartDayData,
  PoolStorageTransaction,
  PublicTokenChartDayData,
  InfoTokenTransaction,
  PublicTokenPricesData,
  TokenPoolsInfo,
  UserStorageTransaction,
  PositionTransaction,
} from "@icpswap/candid";

export type AllPoolsTVL = Array<[string, number]>;

export type AllTokensTVL = Array<[string, number]>;

export type PoolLatestTVL = { tvlUSD: number; tvlUSDChange: number };

export type TokenLatestTVL = { tvlUSD: number; tvlUSDChange: number };

export type InfoPriceChartData = {
  time: number;
  id: string;
  low: number;
  high: number;
  close: number;
  open: number;
  timestamp: bigint | undefined;
};

export type InfoPublicPoolWithTvl = Override<
  PublicPoolOverView,
  { tvlUSD: number; feeTier: bigint; volumeUSD: number; totalVolumeUSD: number; volume7D: number }
>;

export enum VolumeWindow {
  daily,
  weekly,
  monthly,
}

export type PoolPositionHolderRow = {
  accountId: string;
  dayId: number;
  poolId: string;
  positionId: string;
  snapshotTime: number;
  token0Amount: string;
  token0USDPrice: string;
  token1Amount: string;
  token1USDPrice: string;
  value: string;
};

export type PoolPositionHolderResult = {
  poolTvlUSD: string;
  totalPositionSize: number;
  positionList: Array<PoolPositionHolderRow>;
};
