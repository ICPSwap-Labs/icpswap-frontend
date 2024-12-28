import { isNullArgs } from "@icpswap/utils";
import { useFarmInfo, useV3UserFarmInfo } from "@icpswap/hooks";
import { useMemo } from "react";
import { Null } from "@icpswap/types";
import { useAccountPrincipalString } from "store/auth/hooks";

interface UseLiquidityIsStakedByOwner {
  positionId: string;
  farmId: string | Null;
}

export function useLiquidityIsStakedByOwner({ positionId, farmId }: UseLiquidityIsStakedByOwner) {
  const principal = useAccountPrincipalString();

  const { result: userFarmInfo } = useV3UserFarmInfo(farmId, principal);

  return useMemo(() => {
    if (isNullArgs(userFarmInfo)) return null;

    return !!userFarmInfo.positionIds.find((e) => e.toString() === positionId);
  }, [userFarmInfo, positionId]);
}

interface UseLiquidityIsStaked {
  positionId: string;
  farmId: string | Null;
}

export function useLiquidityIsStaked({ positionId, farmId }: UseLiquidityIsStaked) {
  const { result: farmInfo } = useFarmInfo(farmId);

  return useMemo(() => {
    if (isNullArgs(farmInfo)) return false;

    return !!farmInfo.positionIds.find((e) => e.toString() === positionId);
  }, [farmInfo, positionId]);
}
