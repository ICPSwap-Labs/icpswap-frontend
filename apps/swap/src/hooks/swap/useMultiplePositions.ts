import { useMemo } from "react";
import { Position } from "@icpswap/swap-sdk";
import { usePools, type PoolKey } from "hooks/swap/usePools";
import { useTokens } from "hooks/useCurrency";
import type { PoolMetadata } from "@icpswap/types";

export interface PositionInfo {
  liquidity: bigint;
  tickLower: bigint;
  tickUpper: bigint;
}

export interface UseMultiplePositionProps {
  positionInfos: PositionInfo[] | undefined;
  metadata: PoolMetadata | undefined;
}

export function useMultiplePositions(args: UseMultiplePositionProps[]) {
  const { tokenIds } = useMemo(() => {
    const tokenIds: string[] = [];

    args.forEach((arg) => {
      const metadata = arg.metadata;

      if (metadata) {
        if (!tokenIds.includes(metadata.token0.address)) {
          tokenIds.push(metadata.token0.address);
        }

        if (!tokenIds.includes(metadata.token1.address)) {
          tokenIds.push(metadata.token1.address);
        }
      }
    });

    return { tokenIds };
  }, [args]);

  const tokens = useTokens(tokenIds);

  const poolKeys = useMemo(() => {
    return args.map((arg) => {
      const metadata = arg.metadata;

      if (!metadata) return [undefined, undefined, undefined] as PoolKey;

      const tokenA = tokens.find((e) => {
        return e[1]?.address === metadata.token0.address;
      });

      const tokenB = tokens.find((e) => {
        return e[1]?.address === metadata.token1.address;
      });

      return [tokenA ? tokenA[1] : undefined, tokenB ? tokenB[1] : undefined, Number(metadata.fee)] as PoolKey;
    });
  }, [args, tokens]);

  const pools = usePools(poolKeys);

  return useMemo(() => {
    const positions = args.map((arg, index) => {
      const infos = arg.positionInfos;
      const pool = pools[index]?.[1];

      if (!infos) return undefined;

      return infos.map((info) => {
        if (!pool) return undefined;

        return new Position({
          pool,
          liquidity: info.liquidity.toString(),
          tickLower: Number(info.tickLower),
          tickUpper: Number(info.tickUpper),
        });
      });
    });

    return positions;
  }, [args, pools]);
}
