import { nowInSeconds } from "@icpswap/utils";
import type { FarmInfo, FarmState } from "@icpswap/types";

export function getFarmState(farmInfo: FarmInfo): FarmState {
  const now = nowInSeconds();

  if ("CLOSED" in farmInfo.status) return "FINISHED";

  if (farmInfo.startTime > BigInt(now)) return "NOT_STARTED";
  if (farmInfo.endTime <= BigInt(now)) return "FINISHED";

  return "LIVE";
}

export function useFarmState(farmInfo: FarmInfo | undefined): FarmState | undefined {
  if (!farmInfo) return undefined;

  return getFarmState(farmInfo);
}
