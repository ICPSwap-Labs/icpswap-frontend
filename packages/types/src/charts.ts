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
