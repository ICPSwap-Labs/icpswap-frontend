import { useCallback, useMemo } from "react";
import { useErc20DissolveTxs, useErc20AllMintTxs, useErc20UnTxFinalizedTxs } from "store/web3/hooks";
import { isUndefinedOrNull } from "@icpswap/utils";

export function useErc20UnFinalizedMintHashes() {
  const erc20MintTxs = useErc20UnTxFinalizedTxs();

  return useMemo(() => {
    if (isUndefinedOrNull(erc20MintTxs)) return [];

    return erc20MintTxs.map((tx) => tx.hash) as string[];
  }, [erc20MintTxs]);
}

export function useErc20UnFinalizedDissolveHashes() {
  const erc20DissolveTxs = useErc20DissolveTxs();

  return useMemo(() => {
    if (isUndefinedOrNull(erc20DissolveTxs)) return [];
    return erc20DissolveTxs.filter((tx) => !!tx.hash && tx.state !== "TxFinalized").map((tx) => tx.hash) as string[];
  }, [erc20DissolveTxs]);
}

export function useIsErc20MintHash() {
  const mintTxs = useErc20AllMintTxs();

  return useCallback(
    (hash: string) => {
      if (isUndefinedOrNull(mintTxs)) return false;
      return !!mintTxs.find((mintTx) => mintTx.hash === hash);
    },
    [mintTxs],
  );
}
