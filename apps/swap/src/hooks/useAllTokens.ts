import { useEffect, useState, useMemo } from "react";
import { network, NETWORK } from "constants/server";
import { useGlobalTokenList } from "store/global/hooks";
import { getSwapPools } from "@icpswap/hooks";

// The token in TokenList & SwapPools for now
export function useAllTokenIds() {
  const [allTokenIds, setAllTokenIds] = useState<string[]>([]);
  const [swapPoolsTokenIds, setSwapPoolsTokenIds] = useState<string[]>([]);
  const globalTokenList = useGlobalTokenList();

  useEffect(() => {
    if (network === NETWORK.IC) {
      Promise.all([getSwapPools()]).then(([allSwapPools]) => {
        const allTokenIds = allSwapPools?.reduce((prev, curr) => {
          return prev.concat([curr.token0.address, curr.token1.address]);
        }, [] as string[]);

        setSwapPoolsTokenIds(allTokenIds ?? []);
      });
    }
  }, []);

  useEffect(() => {
    if (network === NETWORK.IC) {
      // return all token ids one time
      if (swapPoolsTokenIds.length === 0) return;
      const allTokenIds = globalTokenList.map((ele) => ele.canisterId).concat(swapPoolsTokenIds);
      setAllTokenIds([...new Set(allTokenIds)]);
    } else {
      const allTokenIds = globalTokenList.map((ele) => ele.canisterId).concat(swapPoolsTokenIds);
      setAllTokenIds([...new Set(allTokenIds)]);
    }
  }, [swapPoolsTokenIds, globalTokenList]);

  return useMemo(() => allTokenIds, [allTokenIds]);
}
