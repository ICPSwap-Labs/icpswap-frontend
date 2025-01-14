import { useMemo } from "react";
import { useUserLimitOrders } from "@icpswap/hooks";
import { Null } from "@icpswap/types";
import { isNullArgs } from "@icpswap/utils";
import { useAccountPrincipal } from "store/auth/hooks";

interface UseIsLimitOrderProps {
  poolId: string | Null;
  positionId: string | number | bigint | Null;
}

export function useIsLimitOrder({ poolId, positionId }: UseIsLimitOrderProps) {
  const principal = useAccountPrincipal();

  const { result: userLimitOrders } = useUserLimitOrders(poolId, principal?.toString());

  return useMemo(() => {
    if (isNullArgs(positionId)) return false;
    return userLimitOrders ? !!userLimitOrders.find((e) => e.userPositionId === BigInt(positionId)) : false;
  }, [userLimitOrders, positionId]);
}
