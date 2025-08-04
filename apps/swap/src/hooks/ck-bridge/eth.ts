import { useCallback, useMemo } from "react";
import { useEthDissolveTxs, useEthUnTxFinalizedTxs, useErc20DissolveTxs, useErc20AllMintTxs } from "store/web3/hooks";
import { isUndefinedOrNull } from "@icpswap/utils";

export function useEthUnFinalizedMintHashes() {
  const mintTxs = useEthUnTxFinalizedTxs();
  const dissolveTxs = useEthDissolveTxs();

  const erc20DissolveTxs = useErc20DissolveTxs();
  const erc20MintTxs = useErc20AllMintTxs();

  return useMemo(() => {
    if (isUndefinedOrNull(mintTxs)) return [];

    return mintTxs.map((mintTx) => mintTx.hash);
  }, [mintTxs, dissolveTxs, erc20DissolveTxs, erc20MintTxs]);
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
      return !!(mintTxs ?? []).find((mintTx) => mintTx.hash === hash);
    },
    [mintTxs],
  );
}
