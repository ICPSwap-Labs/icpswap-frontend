import { useEffect, useMemo } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useUpdateEthereumTxResponse } from "store/web3/hooks";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useWeb3React } from "@web3-react/core";
import { isEthereumMintFinalized } from "utils/web3/dissolve";
import { useSuccessTip } from "hooks/useTips";
import {
  useErc20UnFinalizedDissolveHashes,
  useErc20UnFinalizedMintHashes,
  useIsErc20MintHash,
} from "hooks/ck-bridge/erc20";
import { useEthUnFinalizedDissolveHashes, useEthUnFinalizedMintHashes, useIsEthMintHash } from "hooks/ck-bridge/eth";

const INTERVAL_TIME = 20000;

export function useEthereumTxWatcher() {
  const principal = useAccountPrincipalString();
  const { provider } = useWeb3React();
  const updateEthereumTxResponse = useUpdateEthereumTxResponse();
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

  useEffect(() => {
    async function call() {
      if (ethereumHashes.length === 0 || isUndefinedOrNull(principal) || isUndefinedOrNull(provider)) return;

      for (let i = 0; i < ethereumHashes.length; i++) {
        const hash = ethereumHashes[i];
        const transaction = await provider.getTransaction(hash);

        if ((isEthMintHash(hash) || isErc20MintHash(hash)) && isEthereumMintFinalized(transaction)) {
          openTip("Mint is successfully");
        }

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
  }, [ethereumHashes, provider, principal, isEthMintHash, openTip]);
}
