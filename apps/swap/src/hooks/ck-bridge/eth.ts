import { useCallback, useMemo } from "react";
import { useEthDissolveTxs, useEthUnTxFinalizedTxs } from "store/web3/hooks";
import { isUndefinedOrNull } from "@icpswap/utils";

export function useEthUnFinalizedMintHashes() {
  const mintTxs = useEthUnTxFinalizedTxs();

  return useMemo(() => {
    if (isUndefinedOrNull(mintTxs)) return [];
    return mintTxs.map((mintTx) => mintTx.hash);
  }, [mintTxs]);
}

export function useEthUnFinalizedDissolveHashes() {
  const dissolveTxs = useEthDissolveTxs();

  return useMemo(() => {
    if (isUndefinedOrNull(dissolveTxs)) return [];
    return dissolveTxs.filter((tx) => !!tx.hash && tx.state !== "TxFinalized").map((tx) => tx.hash) as string[];
  }, [dissolveTxs]);
}

export function useIsEthMintHash() {
  const mintTxs = useEthUnTxFinalizedTxs();

  return useCallback(
    (hash: string) => {
      if (!mintTxs) return false;
      return !!mintTxs.find((mintTx) => mintTx.hash === hash);
    },
    [mintTxs],
  );
}
