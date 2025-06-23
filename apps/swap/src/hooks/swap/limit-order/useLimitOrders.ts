import { useEffect, useMemo, useState } from "react";
import { useUserLimitOrders, getUserLimitOrders } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { Null, LimitOrder } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useStoreUserPositionPools } from "store/hooks";

export interface UseLimitOrdersProps {
  val: string | Null;
  refreshTrigger?: number;
}

export function useLimitOrders({ val, refreshTrigger }: UseLimitOrdersProps): {
  loading: boolean;
  result: Null | Array<[LimitOrder, string]>;
} {
  const principal = useAccountPrincipal();

  const [allPairLoading, setAllPairLoading] = useState(false);
  const [allLimitOrders, setAllLimitOrders] = useState<Null | Array<[LimitOrder, string]>>(null);

  const { result: userLimitOrders, loading } = useUserLimitOrders(
    val === "ALL PAIR" ? null : val,
    principal?.toString(),
    refreshTrigger,
  );

  const usePositionPools = useStoreUserPositionPools();

  useEffect(() => {
    async function call() {
      if (usePositionPools && val === "ALL PAIR" && principal) {
        setAllPairLoading(true);

        let result: Array<[LimitOrder, string]> = [];

        for (let i = 0; i < usePositionPools.length; i++) {
          const poolId = usePositionPools[i];

          const __result = await getUserLimitOrders(poolId, principal.toString());

          if (__result) {
            result = result.concat(__result.map((limit) => [limit, poolId]));
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
  }, [usePositionPools, val]);

  return useMemo(
    () => ({
      loading: loading || allPairLoading,
      result:
        val === "ALL PAIR" ? allLimitOrders : isUndefinedOrNull(val) ? null : userLimitOrders?.map((ele) => [ele, val]),
    }),
    [allPairLoading, loading, val, allLimitOrders, userLimitOrders],
  );
}
