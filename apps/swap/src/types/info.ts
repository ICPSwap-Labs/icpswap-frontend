import { InfoPoolRealTimeDataResponse, Override } from "@icpswap/types";

export type PoolInfoWithApr = Override<InfoPoolRealTimeDataResponse, { apr24h: string; apr: number }>;
