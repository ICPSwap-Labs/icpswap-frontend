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
  InfoToken,
  PublicTokenChartDayData,
  InfoTokenTransaction,
  PublicTokenPricesData,
  TokenPoolsInfo,
  UserStorageTransaction,
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
