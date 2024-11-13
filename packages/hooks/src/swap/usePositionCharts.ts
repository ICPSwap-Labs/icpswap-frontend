import { isNullArgs, resultFormat } from "@icpswap/utils";
import { useCallback } from "react";
import type {
  Null,
  PositionPricePeriodRange,
  PositionValueChartData,
  PositionFeeChartData,
  PositionAPRChartData,
  PositionAPRs,
} from "@icpswap/types";
import { positionCharts } from "@icpswap/actor";

import { Principal } from "@dfinity/principal";
import { useCallsData } from "../useCallData";

export async function getPositionPricePeriodRange(poolId: string) {
  const result = await (await positionCharts()).getPriceIndex(Principal.fromText(poolId));
  return resultFormat<PositionPricePeriodRange>(result).data;
}

export function usePositionPricePeriodRange(poolId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (!poolId) return undefined;
      return await getPositionPricePeriodRange(poolId);
    }, [poolId]),
  );
}

export async function getPositionValueChartData(poolId: string, positionId: bigint) {
  const result = await (await positionCharts()).queryPositionValueLine(Principal.fromText(poolId), positionId);
  return resultFormat<Array<PositionValueChartData>>(result).data;
}

export function usePositionValueChartData(poolId: string | Null, positionId: bigint | Null) {
  return useCallsData(
    useCallback(async () => {
      if (isNullArgs(poolId) || isNullArgs(positionId)) return undefined;
      return await getPositionValueChartData(poolId, positionId);
    }, [poolId, positionId]),
  );
}

export async function getPositionFeesChartData(poolId: string, positionId: bigint) {
  const result = await (await positionCharts()).queryPositionFeesLine(Principal.fromText(poolId), positionId);
  return resultFormat<Array<PositionFeeChartData>>(result).data;
}

export function usePositionFeesChartData(poolId: string | Null, positionId: bigint | Null) {
  return useCallsData(
    useCallback(async () => {
      if (isNullArgs(poolId) || isNullArgs(positionId)) return undefined;
      return await getPositionFeesChartData(poolId, positionId);
    }, [poolId, positionId]),
  );
}

export async function getPositionAPRChartData(poolId: string, positionId: bigint) {
  const result = await (await positionCharts()).queryPositionAprLine(Principal.fromText(poolId), positionId);
  return resultFormat<Array<PositionAPRChartData>>(result).data;
}

export function usePositionAPRChartData(poolId: string | Null, positionId: bigint | Null) {
  return useCallsData(
    useCallback(async () => {
      if (isNullArgs(poolId) || isNullArgs(positionId)) return undefined;
      return await getPositionAPRChartData(poolId, positionId);
    }, [poolId, positionId]),
  );
}

export async function getPositionAPRs(poolId: string | Null) {
  const result = await (await positionCharts()).getPoolAprIndex(Principal.fromText(poolId));
  return resultFormat<PositionAPRs>(result).data;
}

export function usePositionAPRs(poolId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (isNullArgs(poolId)) return undefined;
      return await getPositionAPRs(poolId);
    }, [poolId]),
  );
}
