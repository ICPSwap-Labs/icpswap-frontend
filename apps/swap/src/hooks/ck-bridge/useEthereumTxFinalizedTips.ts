import { useEffect, useMemo } from "react";
import { getEthereumTxResponse } from "store/web3/hooks";
import { isUndefinedOrNull } from "@icpswap/utils";
import { isEthereumMintFinalizedByConfirmations } from "utils/web3/dissolve";
import { useSuccessTip } from "hooks/useTips";
import {
  useErc20UnFinalizedDissolveHashes,
  useErc20UnFinalizedMintHashes,
  useIsErc20MintHash,
} from "hooks/ck-bridge/erc20";
import { useEthUnFinalizedDissolveHashes, useEthUnFinalizedMintHashes, useIsEthMintHash } from "hooks/ck-bridge/eth";
import { useEthereumConfirmationsCallback } from "./useEthereumConfirmations";

export function useEthereumTxFinalizedTips() {
  const [openTip] = useSuccessTip();

  const isEthMintHash = useIsEthMintHash();
  const isErc20MintHash = useIsErc20MintHash();

  const ethDissolveHashes = useEthUnFinalizedDissolveHashes();
  const ethMintHashes = useEthUnFinalizedMintHashes();
  const erc20DissolveHashes = useErc20UnFinalizedDissolveHashes();
  const erc20MintHashes = useErc20UnFinalizedMintHashes();

  const ethereumHashes = useMemo(() => {
    return [...ethDissolveHashes, ...ethMintHashes, ...erc20DissolveHashes, ...erc20MintHashes];
  }, [ethDissolveHashes, ethMintHashes, erc20DissolveHashes, erc20MintHashes]);

  const getConfirmations = useEthereumConfirmationsCallback();

  useEffect(() => {
    async function call() {
      if (ethereumHashes.length === 0) return;

      for (let i = 0; i < ethereumHashes.length; i++) {
        const hash = ethereumHashes[i];
        const transactionResponse = getEthereumTxResponse(hash);

        if (isUndefinedOrNull(transactionResponse)) return;

        const confirmations = getConfirmations(transactionResponse);

        if (isUndefinedOrNull(confirmations)) return;

        if ((isEthMintHash(hash) || isErc20MintHash(hash)) && isEthereumMintFinalizedByConfirmations(confirmations)) {
          openTip("Mint is successfully");
        }
      }
    }

    call();
  }, [ethereumHashes, isEthMintHash, openTip, getConfirmations]);
}
