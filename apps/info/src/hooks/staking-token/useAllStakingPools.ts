import { useCallback } from "react";
import { getStakingPools, usePaginationAllData, getPaginationAllData } from "@icpswap/hooks";

export async function getAllTokenPools() {
  const call = async (offset: number, limit: number) => {
    return await getStakingPools(undefined, offset, limit);
  };

  return getPaginationAllData(call, 500);
}

export function useStakingTokenAllPools() {
  const call = useCallback(async (offset: number, limit: number) => {
    return await getStakingPools(undefined, offset, limit);
  }, []);

  return usePaginationAllData(call, 500);
}
