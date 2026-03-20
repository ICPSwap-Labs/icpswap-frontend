import { isUndefinedOrNull } from "@icpswap/utils";
import { useCallback, useMemo } from "react";
import { useAllErc20DissolveDetails, useErc20AllMintTxs, useErc20UnTxFinalizedTxs } from "store/web3/hooks";
import { erc20DissolveHash, erc20DissolveStatus } from "utils/web3/dissolve";

export function useErc20UnFinalizedMintHashes() {
  const erc20MintTxs = useErc20UnTxFinalizedTxs();

  return useMemo(() => {
    if (isUndefinedOrNull(erc20MintTxs)) return [];

    return erc20MintTxs.map((tx) => tx.hash) as string[];
  }, [erc20MintTxs]);
}

export function useErc20UnFinalizedDissolveHashes() {
  const erc20DissolveTxs = useAllErc20DissolveDetails();

  return useMemo(() => {
    if (isUndefinedOrNull(erc20DissolveTxs)) return [];

    return erc20DissolveTxs
      .filter((tx) => {
        const state = erc20DissolveStatus(tx.status);
        const hash = erc20DissolveHash(tx.status);

        return !!hash && state !== "TxFinalized";
      })
      .map((tx) => erc20DissolveHash(tx.status)) as string[];
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
