import { useCallback } from "react";
import { getV3StakingFarms, usePaginationAllData, getPaginationAllData } from "@icpswap/hooks";

export async function getAllFarms() {
  const call = async (offset: number, limit: number) => {
    return await getV3StakingFarms(offset, limit, "all");
  };

  return getPaginationAllData(call, 400);
}

export function useAllFarmPools() {
  const call = useCallback(async (offset: number, limit: number) => {
    return await getV3StakingFarms(offset, limit, "all");
  }, []);

  return usePaginationAllData(call, 100);
}
