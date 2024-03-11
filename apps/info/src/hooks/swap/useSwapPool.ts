import { useMemo, useEffect, useState } from "react";
import { getSwapPool } from "@icpswap/hooks";
import type { SwapPoolData } from "@icpswap/types";
import { getTokenStandard } from "store/token/cache/hooks";

export function useSwapPool(token0: string | undefined, token1: string | undefined, fee: number | undefined) {
  const [poolData, setPoolData] = useState<SwapPoolData | null | undefined>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function call() {
      if (token0 && token1 && fee) {
        const token0Standard = getTokenStandard(token0);
        const token1Standard = getTokenStandard(token1);

        if (token0Standard && token1Standard) {
          setLoading(true);

          const args = {
            token0: { address: token0, standard: token0Standard },
            token1: { address: token1, standard: token1Standard },
            fee: BigInt(fee),
            sqrtPriceX96: "0",
          };

          const poolData = await getSwapPool(args);
          setPoolData(poolData);
        }
      }
    }

    call();
  }, [token1, token0, fee]);

  return useMemo(() => {
    return {
      loading,
      result: poolData,
    };
  }, [poolData, loading]);
}
