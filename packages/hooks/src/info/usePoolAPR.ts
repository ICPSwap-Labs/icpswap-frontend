import { useMemo } from "react";
import { BigNumber, isNullArgs } from "@icpswap/utils";
import type { Null } from "@icpswap/types";

interface UsePoolAPRProps {
  volumeUSD: string | number | bigint | Null;
  tvlUSD: string | number | bigint | Null;
  timeBase?: "24H" | "7D";
}

export function usePoolAPR({ volumeUSD, tvlUSD, timeBase = "24H" }: UsePoolAPRProps) {
  const allFees = useMemo(() => {
    if (isNullArgs(volumeUSD)) return null;
    return new BigNumber(volumeUSD.toString()).multipliedBy(3).dividedBy(1000);
  }, [volumeUSD]);

  return useMemo(() => {
    if (isNullArgs(allFees) || isNullArgs(tvlUSD)) return undefined;
    if (new BigNumber(tvlUSD.toString()).isEqualTo(0)) return null;
    if (new BigNumber(allFees.toString()).isEqualTo(0)) return null;

    return `${new BigNumber(allFees)
      .multipliedBy(0.8)
      .dividedBy(tvlUSD.toString())
      .multipliedBy(timeBase === "7D" ? new BigNumber(360).dividedBy(7) : 360)
      .multipliedBy(100)
      .toFixed(2)}%`;
  }, [allFees, tvlUSD, timeBase]);
}

interface GetPoolAPRProps {
  volumeUSD: string | number | bigint;
  tvlUSD: string | number | bigint;
  timeBase?: "24H" | "7D";
}

export function getPoolAPR({ volumeUSD, tvlUSD, timeBase }: GetPoolAPRProps): string | null {
  const allFees = new BigNumber(volumeUSD.toString()).multipliedBy(3).dividedBy(1000);

  if (new BigNumber(tvlUSD.toString()).isEqualTo(0) || new BigNumber(allFees.toString()).isEqualTo(0)) {
    return null;
  }

  return `${new BigNumber(allFees)
    .multipliedBy(0.8)
    .dividedBy(tvlUSD.toString())
    .multipliedBy(timeBase === "7D" ? new BigNumber(360).dividedBy(7) : 360)
    .multipliedBy(100)
    .toFixed(2)}%`;
}
