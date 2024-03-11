export enum VolumeWindow {
  daily,
  weekly,
  monthly,
}

export interface ChartDayVolumeData {
  date: number;
  volumeUSD: number;
}

export interface GenericChartEntry {
  time: string;
  value: number;
}

export type { PublicPoolOverView, PoolStorageTransaction } from "@icpswap/types";
