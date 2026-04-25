import { isUndefinedOrNull } from "@icpswap/utils";
import { useDogeBlockNumber } from "hooks/ck-bridge/doge/useBlockNumber";
import { useMemo } from "react";

export function useDogeBlockConfirmations(block: number | string | null | undefined) {
  const currentBlock = useDogeBlockNumber();

  return useMemo(() => {
    if (isUndefinedOrNull(currentBlock) || isUndefinedOrNull(block)) return undefined;
    return Number(currentBlock) - Number(block);
  }, [currentBlock, block]);
}
