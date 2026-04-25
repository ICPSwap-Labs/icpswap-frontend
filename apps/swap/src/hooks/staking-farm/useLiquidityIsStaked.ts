import { useFarmInfo, useUserFarmInfo } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useMemo } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";

interface UseLiquidityIsStakedByOwner {
  positionId: string;
  farmId: string | Null;
}

export function useLiquidityIsStakedByOwner({ positionId, farmId }: UseLiquidityIsStakedByOwner) {
  const principal = useAccountPrincipalString();

  const { data: userFarmInfo } = useUserFarmInfo(farmId, principal);

  return useMemo(() => {
    if (isUndefinedOrNull(userFarmInfo)) return null;

    return !!userFarmInfo.positionIds.find((e) => e.toString() === positionId);
  }, [userFarmInfo, positionId]);
}

interface UseLiquidityIsStaked {
  positionId: string;
  farmId: string | Null;
}

export function useLiquidityIsStaked({ positionId, farmId }: UseLiquidityIsStaked) {
  const { data: farmInfo } = useFarmInfo(farmId);

  return useMemo(() => {
    if (isUndefinedOrNull(farmInfo)) return false;

    return !!farmInfo.positionIds.find((e) => e.toString() === positionId);
  }, [farmInfo, positionId]);
}
