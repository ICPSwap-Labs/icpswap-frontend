import { BridgeChainType, BridgeType } from "@icpswap/constants";
import { ckETH } from "@icpswap/tokens";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useMemo } from "react";
import { useEthDissolveTxs, useEthUnTxFinalizedTxs } from "store/web3/hooks";
import type { EthereumTransactionEvent } from "types/web3";

export function useEthEvents() {
  const ethMintTxs = useEthUnTxFinalizedTxs();
  const allEthDissolveTx = useEthDissolveTxs();

  const ethMintEvents: EthereumTransactionEvent[] = useMemo(() => {
    if (isUndefinedOrNull(ethMintTxs)) return [];

    return ethMintTxs.map((mintTx) => {
      return {
        hash: mintTx.hash,
        amount: mintTx.value,
        type: BridgeType.mint,
        chain: BridgeChainType.eth,
        token: ckETH.address,
      };
    });
  }, [ethMintTxs]);

  const ethDissolveEvents: EthereumTransactionEvent[] = useMemo(() => {
    return (allEthDissolveTx ?? [])
      .filter((dissolveTx) => {
        return dissolveTx.state !== "TxFinalized";
      })
      .map((dissolveTx) => {
        return {
          hash: dissolveTx.hash,
          amount: dissolveTx.value,
          type: BridgeType.dissolve,
          chain: BridgeChainType.eth,
          token: ckETH.address,
        };
      });
  }, [allEthDissolveTx]);

  return useMemo(() => {
    return [...ethMintEvents, ...ethDissolveEvents];
  }, [ethMintEvents, ethDissolveEvents]);
}
