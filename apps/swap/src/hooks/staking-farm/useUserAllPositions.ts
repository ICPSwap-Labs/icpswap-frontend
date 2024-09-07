import { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { useUserPositionPools, useLiveFarmsByPoolIds, getSwapUserPositions, getSwapPoolMeta } from "@icpswap/hooks";
import { useAccount, useAccountPrincipal } from "store/auth/hooks";
import { UserPositionInfoWithId, PoolMetadata } from "@icpswap/types";
import { usePositionsValuesByInfos } from "hooks/swap/index";

export function useFarmUserAllPositions() {
  const account = useAccount();
  const principal = useAccountPrincipal();

  const [positionAmount, setPositionAmount] = useState<null | number>(null);
  const [positionResult, setPositionResult] = useState<
    | null
    | {
        positions: UserPositionInfoWithId[];
        metadata: PoolMetadata;
      }[]
  >(null);

  const { result: userPositionsPools } = useUserPositionPools(account);
  const { result: farms } = useLiveFarmsByPoolIds(userPositionsPools);

  useEffect(() => {
    async function call() {
      if (farms && principal) {
        // One pool could have multiple farms, so remove the duplicate pool
        const allPoolIds = [...new Set(farms.map((farm) => farm[0].toString()))];

        const result = (
          await Promise.all(
            allPoolIds.map(async (poolId) => {
              const metadata = await getSwapPoolMeta(poolId);
              const positions = await getSwapUserPositions(poolId, principal.toString());

              // Filter the invalid position
              return { metadata, positions: positions.filter((position) => position.liquidity !== BigInt(0)) };
            }),
          )
        ).flat();

        const positionAmount = result.flat().reduce((prev, curr) => {
          return prev.plus(curr.positions.length);
        }, new BigNumber(0));

        setPositionAmount(positionAmount.toNumber());
        setPositionResult(result.filter((e) => e.positions.length > 0));
      }
    }

    call();
  }, [farms, principal]);

  const positionInfos = useMemo(() => {
    if (!positionResult) return [];

    const __positionInfos = positionResult.map((e) => ({
      metadata: e.metadata,
      positionInfos: e.positions,
    }));

    return __positionInfos;
  }, [positionResult]);

  const allPositionUSDValue = usePositionsValuesByInfos(positionInfos);

  return useMemo(
    () => ({ positionsValue: allPositionUSDValue, positionAmount }),
    [allPositionUSDValue, positionAmount],
  );
}
