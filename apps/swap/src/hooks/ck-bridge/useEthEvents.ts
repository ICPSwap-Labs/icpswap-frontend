import { useMemo } from "react";
import { useEthDissolveTxs, useEthUnTxFinalizedTxs } from "store/web3/hooks";
import { ckETH } from "@icpswap/tokens";
import { EthereumMintTransactionEvent } from "types/web3";

export function useEthEvents() {
  const ethMintTxs = useEthUnTxFinalizedTxs();
  const allEthDissolveTx = useEthDissolveTxs();

  const ethMintEvents: EthereumMintTransactionEvent[] = useMemo(() => {
    return (ethMintTxs ?? []).map((mintTx) => {
      return {
        hash: mintTx.hash,
        amount: mintTx.value,
        type: "mint",
        chain: "eth",
        token: ckETH.address,
      };
    });
  }, [ethMintTxs]);

  const ethDissolveEvents: EthereumMintTransactionEvent[] = useMemo(() => {
    return (allEthDissolveTx ?? [])
      .filter((dissolveTx) => {
        return dissolveTx.state !== "TxFinalized";
      })
      .map((dissolveTx) => {
        return {
          hash: dissolveTx.hash,
          amount: dissolveTx.value,
          type: "dissolve",
          chain: "eth",
          token: ckETH.address,
        };
      });
  }, [allEthDissolveTx]);

  return useMemo(() => {
    return [...ethMintEvents, ...ethDissolveEvents];
  }, [ethMintEvents, ethDissolveEvents]);
}
