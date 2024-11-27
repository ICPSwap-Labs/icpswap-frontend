import { getSwapPool } from "@icpswap/hooks";
import { ICP } from "@icpswap/tokens";
import { useEffect, useMemo, useState } from "react";
import { getTokenStandard } from "store/token/cache/hooks";

export function usePoolIdWithICP(canisterId: string | undefined) {
  const [poolId, setPoolId] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function call() {
      const tokenStandard = getTokenStandard(canisterId);

      if (canisterId && tokenStandard) {
        let token0Id = "";

        if (canisterId > ICP.address) {
          token0Id = ICP.address;
        } else {
          token0Id = ICP.address;
        }

        const args = {
          token0: {
            address: token0Id === canisterId ? canisterId : ICP.address,
            standard: token0Id === canisterId ? tokenStandard : ICP.standard,
          },
          token1: {
            address: token0Id === canisterId ? ICP.address : canisterId,
            standard: token0Id === canisterId ? ICP.standard : tokenStandard,
          },
          fee: BigInt(3000),
          sqrtPriceX96: "0",
        };

        const poolData = await getSwapPool(args);

        if (poolData) {
          setPoolId(poolData.canisterId.toString());
        }
      }
    }

    call();
  }, [canisterId]);

  return useMemo(() => poolId, [poolId]);
}
