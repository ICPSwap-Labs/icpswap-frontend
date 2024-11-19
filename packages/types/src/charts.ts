import { Principal } from "@dfinity/principal";

export interface ChartDayVolumeData {
  date: number;
  volumeUSD: number;
}

export interface GenericChartEntry {
  time: string;
  value: number;
}

export type PositionValueChartData = {
  snapshotTime: bigint;
  value: number;
  positionId: bigint;
  dayId: bigint;
  poolId: Principal;
};

export type PositionFeeChartData = {
  snapshotTime: bigint;
  fees: number;
  positionId: bigint;
  dayId: bigint;
  poolId: Principal;
};

export type PositionAPRChartData = {
  apr: number;
  snapshotTime: bigint;
  positionId: bigint;
  dayId: bigint;
  poolId: Principal;
};

export type PoolAPRChartData = {
  apr: number;
  snapshotTime: bigint;
  dayId: bigint;
  poolId: string;
};

export enum ChartTimeEnum {
  "24H" = "24H",
  "7D" = "7D",
  "30D" = "30D",
}
