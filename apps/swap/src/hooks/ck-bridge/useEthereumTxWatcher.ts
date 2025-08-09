import { useEffect, useMemo } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";
import {
  useErc20AllMintTxs,
  useEthereumFinalizedHashesManager,
  useEthMintTxs,
  useUpdateEthereumTxResponse,
} from "store/web3/hooks";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useWeb3React } from "@web3-react/core";
import { useSuccessTip } from "hooks/useTips";
import { useErc20UnFinalizedDissolveHashes, useErc20UnFinalizedMintHashes } from "hooks/ck-bridge/erc20";
import { useEthUnFinalizedDissolveHashes, useEthUnFinalizedMintHashes } from "hooks/ck-bridge/eth";
import { useEthereumConfirmationsByBlockCallback } from "hooks/ck-bridge/useEthereumConfirmations";
import { ETHEREUM_CONFIRMATIONS } from "constants/web3";

const INTERVAL_TIME = 20000;

export function useEthereumTxWatcher() {
  const principal = useAccountPrincipalString();
  const { provider } = useWeb3React();
  const updateEthereumTxResponse = useUpdateEthereumTxResponse();

  const ethDissolveHashes = useEthUnFinalizedDissolveHashes();
  const ethUnFinalizedMintHashes = useEthUnFinalizedMintHashes();
  const erc20DissolveHashes = useErc20UnFinalizedDissolveHashes();
  const erc20MintHashes = useErc20UnFinalizedMintHashes();

  const ethereumHashes = useMemo(() => {
    return [...ethDissolveHashes, ...ethUnFinalizedMintHashes, ...erc20DissolveHashes, ...erc20MintHashes];
  }, [ethDissolveHashes, ethUnFinalizedMintHashes, erc20DissolveHashes, erc20MintHashes]);

  useEffect(() => {
    async function call() {
      if (ethereumHashes.length === 0 || isUndefinedOrNull(principal) || isUndefinedOrNull(provider)) return;

      for (let i = 0; i < ethereumHashes.length; i++) {
        const hash = ethereumHashes[i];
        const transaction = await provider.getTransaction(hash);
        updateEthereumTxResponse(hash, transaction);
      }
    }

    const timer = setInterval(() => {
      call();
    }, INTERVAL_TIME);

    call();

    return () => {
      clearInterval(timer);
    };
  }, [ethereumHashes, provider, principal]);
}

export function useEthereumTxTips() {
  const [openTip] = useSuccessTip();
  const ethMintTxs = useEthMintTxs();
  const erc20MintTxs = useErc20AllMintTxs();

  const [ethereumFinalizedHashes, updateFinalizedHash] = useEthereumFinalizedHashesManager();

  const getConfirmations = useEthereumConfirmationsByBlockCallback();

  useEffect(() => {
    async function call() {
      const allTxs = [...(ethMintTxs ?? []), ...(erc20MintTxs ?? [])];

      for (let i = 0; i < allTxs.length; i++) {
        const tx = allTxs[i];

        const confirmations = getConfirmations(Number(tx.block));

        if (isUndefinedOrNull(confirmations)) return;

        if (confirmations === ETHEREUM_CONFIRMATIONS && !ethereumFinalizedHashes.includes(tx.hash)) {
          openTip("Mint is successfully");
          updateFinalizedHash(tx.hash);
        }
      }
    }

    call();
  }, [ethMintTxs, erc20MintTxs, getConfirmations, ethereumFinalizedHashes, updateFinalizedHash]);
}
