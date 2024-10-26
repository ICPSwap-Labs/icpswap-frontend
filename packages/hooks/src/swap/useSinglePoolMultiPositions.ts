import { useMemo } from "react";
import { Pool, Position } from "@icpswap/swap-sdk";

interface PositionInfo {
  liquidity: bigint;
  tickLower: bigint;
  tickUpper: bigint;
}

export interface GetSinglePoolMultiPositionsProps {
  positionInfos: PositionInfo[];
  pool: Pool;
}

export function getSinglePoolMultiPositions({ pool, positionInfos }: GetSinglePoolMultiPositionsProps) {
  const positions = positionInfos.map((positionInfo) => {
    return new Position({
      pool,
      liquidity: positionInfo.liquidity.toString(),
      tickLower: Number(positionInfo.tickLower),
      tickUpper: Number(positionInfo.tickUpper),
    });
  });

  return positions;
}

export interface UseSinglePoolMultiPositionsProps {
  positionInfos: PositionInfo[] | undefined;
  pool: Pool | null | undefined;
}

export function useSinglePoolMultiPositions({ pool, positionInfos }: UseSinglePoolMultiPositionsProps) {
  return useMemo(() => {
    if (!pool || !positionInfos) return undefined;

    return getSinglePoolMultiPositions({ pool, positionInfos });
  }, [positionInfos, pool]);
}
