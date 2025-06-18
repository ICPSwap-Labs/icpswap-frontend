import { useEffect, useMemo, useState } from "react";
import { getUserFarmInfo } from "@icpswap/hooks";
import { type FarmInfoWithId } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useAccountPrincipal } from "store/auth/hooks";

import { useYourFarms } from "./useYourFarms";

export function useUserAllFarmsInfo() {
  const principal = useAccountPrincipal();
  const [loading, setLoading] = useState<boolean>(false);
  const [farmsInfo, setFarmsInfo] = useState<null | Array<FarmInfoWithId>>(null);

  const { result: userAllFarms, loading: farmsLoading } = useYourFarms();

  useEffect(() => {
    async function call() {
      if (isUndefinedOrNull(userAllFarms) || isUndefinedOrNull(principal)) {
        setFarmsInfo(null);
        return;
      }

      if (userAllFarms.length === 0) {
        setFarmsInfo([]);
        return;
      }

      setLoading(true);

      const allFarmsInfo = await Promise.all(
        userAllFarms.map(async (farmId) => {
          const result = await getUserFarmInfo(farmId.toString(), principal.toString());
          return { ...result, id: farmId.toString() } as FarmInfoWithId;
        }),
      );

      setFarmsInfo(allFarmsInfo);
      setLoading(false);
    }

    call();
  }, [userAllFarms, principal]);

  return useMemo(() => ({ loading: loading || farmsLoading, result: farmsInfo }), [loading, farmsInfo, farmsLoading]);
}
