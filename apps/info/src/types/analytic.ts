export interface ChartDayVolumeData {
  date: number;
  volumeUSD: number;
}

export interface GenericChartEntry {
  time: string;
  value: number;
}

export type { PublicPoolOverView, PoolStorageTransaction } from "@icpswap/types";

export type PriceChart = {
  open: number;
  close: number;
  low: number;
  timestamp: undefined | number;
  time: number;
  id: any;
  high: number;
};
