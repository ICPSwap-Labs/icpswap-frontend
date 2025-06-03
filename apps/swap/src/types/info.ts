import { Override, PublicPoolOverView } from "@icpswap/types";

export type PoolInfoWithApr = Override<PublicPoolOverView, { tvlUSD: number; apr24h: string; apr: number }>;
