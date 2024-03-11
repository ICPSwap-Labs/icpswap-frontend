import { useCallback } from "react";
import { getStakingTokenPools, usePaginationAllData, getPaginationAllData } from "@icpswap/hooks";

export async function getAllTokenPools() {
  const call = async (offset: number, limit: number) => {
    return await getStakingTokenPools(undefined, offset, limit);
  };

  return getPaginationAllData(call, 500);
}

export function useStakingTokenAllPools() {
  const call = useCallback(async (offset: number, limit: number) => {
    return await getStakingTokenPools(undefined, offset, limit);
  }, []);

  return usePaginationAllData(call, 500);
}
