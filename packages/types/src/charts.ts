import { Principal } from "@dfinity/principal";

export interface ChartDayVolumeData {
  timestamp: number;
  volumeUSD: number;
}

export interface GenericChartEntry {
  time: string;
  value: number;
}

export enum ChartTimeEnum {
  "24H" = "24H",
  "7D" = "7D",
  "30D" = "30D",
}
