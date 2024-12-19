import { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import {
  useUserPositionPools,
  useLiveFarmsByPoolIds,
  getSwapUserPositions,
  getSwapPoolMeta,
  getFarmInitArgs,
} from "@icpswap/hooks";
import { useAccount, useAccountPrincipal } from "store/auth/hooks";
import { UserPositionInfoWithId, PoolMetadata, InitFarmArgs } from "@icpswap/types";
import { useMultiPoolPositionsTotalValue } from "hooks/swap/index";

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
        const allFarmIds = [...new Set(farms.map((farm) => farm[1].toString()))];

        const allFarmInitArgs: Array<[InitFarmArgs, string]> = await Promise.all(
          allFarmIds.map(async (farmId) => {
            const farmInitArgs = await getFarmInitArgs(farmId);
            return [farmInitArgs, farmId];
          }),
        );

        const result = (
          await Promise.all(
            allPoolIds.map(async (poolId) => {
              const metadata = await getSwapPoolMeta(poolId);
              const positions = await getSwapUserPositions(poolId, principal.toString());

              const farmInitArgs = allFarmInitArgs.find(([, farmId]) => {
                return farms.find((farm) => farm[1].toString() === farmId && farm[0].toString() === poolId);
              });

              if (farmInitArgs && farmInitArgs[0].priceInsideLimit) {
                // Filter the invalid position and in range position
                return {
                  metadata,
                  positions: positions.filter(
                    (position) =>
                      position.liquidity !== BigInt(0) &&
                      position.tickLower < metadata.tick &&
                      position.tickUpper > metadata.tick,
                  ),
                };
              }

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

  const allPositionUSDValue = useMultiPoolPositionsTotalValue(positionInfos);

  return useMemo(
    () => ({ positionsValue: positionInfos?.length === 0 ? "0" : allPositionUSDValue, positionAmount }),
    [allPositionUSDValue, positionAmount, positionInfos],
  );
}
