import { useEffect, useMemo, useState } from "react";
import { useSwapPools, useUserLimitOrders, getUserLimitOrders } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { Null, LimitOrder, Override } from "@icpswap/types";

type LimitOrderType = Override<LimitOrder, { poolId: string }>;

export interface UseLimitOrdersProps {
  val: string | Null;
  refreshTrigger?: number;
}

export function useLimitOrders({ val, refreshTrigger }: UseLimitOrdersProps) {
  const principal = useAccountPrincipal();

  const [allPairLoading, setAllPairLoading] = useState(false);
  const [allLimitOrders, setAllLimitOrders] = useState<Null | Array<LimitOrderType>>(null);

  const { result: userLimitOrders, loading } = useUserLimitOrders(
    val === "ALL PAIR" ? null : val,
    principal?.toString(),
    refreshTrigger,
  );

  const { result: swapPools } = useSwapPools();

  useEffect(() => {
    async function call() {
      if (swapPools && val === "ALL PAIR" && principal) {
        setAllPairLoading(true);

        let result: Array<LimitOrderType> = [];

        for (let i = 0; i < swapPools.length; i++) {
          const pool = swapPools[i];

          const __result = await getUserLimitOrders(pool.canisterId.toString(), principal.toString());

          if (__result) {
            result = result.concat(__result.map((ele) => ({ ...ele, poolId: pool.canisterId.toString() })));
          }
        }

        setAllLimitOrders(result);
        setAllPairLoading(false);
      } else {
        setAllLimitOrders(null);
        setAllPairLoading(false);
      }
    }

    call();
  }, [swapPools, val]);

  return useMemo(
    () => ({
      loading: loading || allPairLoading,
      result: val === "ALL PAIR" ? allLimitOrders : userLimitOrders?.map((ele) => ({ ...ele, poolId: val })),
    }),
    [allPairLoading, loading, val, allLimitOrders, userLimitOrders],
  );
}
