import { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { useUserPositionPools, useFarmsByPool, getSwapUserPositions, getSwapPoolMeta } from "@icpswap/hooks";
import { useAccount, useAccountPrincipal } from "store/auth/hooks";
import { UserPositionInfoWithId, PoolMetadata } from "@icpswap/types";
import { useUserPositionsValues } from "hooks/swap/index";

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
  const { result: farms } = useFarmsByPool(userPositionsPools);

  useEffect(() => {
    async function call() {
      if (farms && principal) {
        const result = (
          await Promise.all(
            farms.map(async (ele) => {
              const poolId = ele[0].toString();

              const metadata = await getSwapPoolMeta(poolId);
              const positions = await getSwapUserPositions(poolId, principal.toString());

              return { metadata, positions };
            }),
          )
        ).flat();

        const positionAmount = result.flat().reduce((prev, curr) => {
          return prev.plus(curr.positions.length);
        }, new BigNumber(0));

        setPositionAmount(positionAmount.toNumber());
        setPositionResult(result);
      }
    }

    call();
  }, [farms, principal]);

  const positionInfos = useMemo(() => {
    if (!positionResult) return [];

    return positionResult.map((e) => ({
      metadata: e.metadata,
      positionInfos: e.positions,
    }));
  }, [positionResult]);

  const allPositionUSDValue = useUserPositionsValues(positionInfos);

  return useMemo(
    () => ({ positionsValue: allPositionUSDValue, positionAmount }),
    [allPositionUSDValue, positionAmount],
  );
}
