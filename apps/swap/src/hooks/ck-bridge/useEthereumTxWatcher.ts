import { useInterval } from "@icpswap/hooks";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { useErc20UnFinalizedDissolveHashes, useErc20UnFinalizedMintHashes } from "hooks/ck-bridge/erc20";
import { useEthUnFinalizedDissolveHashes, useEthUnFinalizedMintHashes } from "hooks/ck-bridge/eth";
import { useEthereumTxSyncFinalized } from "hooks/ck-bridge/useEthereumConfirmations";
import { useSuccessTip } from "hooks/useTips";
import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAccountPrincipalString } from "store/auth/hooks";
import {
  useErc20AllMintTxs,
  useEthereumFinalizedHashesManager,
  useEthMintTxs,
  useUpdateEthereumTxResponse,
} from "store/web3/hooks";
import { usePublicClient } from "wagmi";

const INTERVAL_TIME = 20000;

export function useEthereumTxWatcher() {
  const principal = useAccountPrincipalString();
  const publicClient = usePublicClient();
  const updateEthereumTxResponse = useUpdateEthereumTxResponse();

  const ethDissolveHashes = useEthUnFinalizedDissolveHashes();
  const ethUnFinalizedMintHashes = useEthUnFinalizedMintHashes();
  const erc20DissolveHashes = useErc20UnFinalizedDissolveHashes();
  const erc20MintHashes = useErc20UnFinalizedMintHashes();

  const ethereumHashes = useMemo(() => {
    return [...ethDissolveHashes, ...ethUnFinalizedMintHashes, ...erc20DissolveHashes, ...erc20MintHashes];
  }, [ethDissolveHashes, ethUnFinalizedMintHashes, erc20DissolveHashes, erc20MintHashes]);

  const callback = useCallback(async () => {
    if (ethereumHashes.length === 0 || isUndefinedOrNull(principal) || isUndefinedOrNull(publicClient)) return;

    for (let i = 0; i < ethereumHashes.length; i++) {
      const hash = ethereumHashes[i];
      const transaction = await publicClient.getTransactionReceipt({ hash: hash as `0x${string}` }).catch((error) => {
        console.error(error);
        return undefined;
      });

      if (nonUndefinedOrNull(transaction)) {
        updateEthereumTxResponse(hash, transaction);
      }
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- stringify array dependency to stop hook loop
  }, [JSON.stringify(ethereumHashes), principal]);

  useInterval({ callback, interval: INTERVAL_TIME });
}

export function useEthereumTxTips() {
  const [openTip] = useSuccessTip();
  const ethereumTxs = useEthMintTxs();
  const erc20Txs = useErc20AllMintTxs();
  const { t } = useTranslation();

  const [ethereumFinalizedHashes, updateFinalizedHash] = useEthereumFinalizedHashesManager();
  const ethereumBlockSynced = useEthereumTxSyncFinalized();

  const allTxs = useMemo(() => {
    return (ethereumTxs ?? []).concat(erc20Txs ?? []);
  }, [ethereumTxs, erc20Txs]);

  const isSyncedTxs = useMemo(() => {
    return allTxs.filter((tx) => {
      return ethereumBlockSynced(Number(tx.block));
    });
  }, [ethereumBlockSynced, allTxs]);

  useEffect(() => {
    async function call() {
      for (let i = 0; i < isSyncedTxs.length; i++) {
        const tx = isSyncedTxs[i];

        if (!ethereumFinalizedHashes.includes(tx.hash)) {
          updateFinalizedHash(tx.hash);
          openTip(t("ck.mint.completed", { symbol: tx.tokenSymbol?.replace("ck", "") }));
        }
      }
    }

    call();
  }, [isSyncedTxs, ethereumFinalizedHashes, updateFinalizedHash, openTip, t]);
}
