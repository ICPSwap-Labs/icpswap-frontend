import { useMemo } from "react";
import { useErc20DissolveTxs } from "hooks/ck-bridge/useErc20DissolveTxs";
import { erc20DissolveHash, isErc20Finalized } from "utils/web3/dissolve";
import { isUndefinedOrNull } from "@icpswap/utils";
import { Erc20DissolveTransactionEvent, EthereumTransactionEvent } from "types/web3";
import { useErc20UnTxFinalizedTxs } from "store/web3/hooks";

export function useErc20DissolveEvents() {
  const { result: erc20DissolveTxs } = useErc20DissolveTxs();

  const erc20DissolveEvents: Erc20DissolveTransactionEvent[] = useMemo(() => {
    if (isUndefinedOrNull(erc20DissolveTxs)) return [];

    return erc20DissolveTxs
      .filter((dissolveTx) => dissolveTx.token_symbol !== "ckETH" && !isErc20Finalized(dissolveTx.status))
      .map((dissolveTx) => {
        return {
          withdrawal_id: dissolveTx.withdrawal_id.toString(),
          hash: erc20DissolveHash(dissolveTx.status),
          amount: dissolveTx.withdrawal_amount.toString(),
          type: "dissolve",
          chain: "erc20",
          token_symbol: dissolveTx.token_symbol,
        };
      });
  }, [erc20DissolveTxs]);

  return useMemo(() => erc20DissolveEvents, [erc20DissolveEvents]);
}

export function useErc20MintEvents() {
  const erc20MintTxs = useErc20UnTxFinalizedTxs();

  const erc20MintEvents: EthereumTransactionEvent[] = useMemo(() => {
    if (isUndefinedOrNull(erc20MintTxs)) return [];

    return erc20MintTxs
      .map((tx) => {
        return {
          hash: tx.hash,
          amount: tx.value,
          type: "mint",
          chain: "erc20",
          token: tx.ledger,
        };
      })
      .filter((tx) => !!tx.token) as EthereumTransactionEvent[];
  }, [erc20MintTxs]);

  return useMemo(() => erc20MintEvents, [erc20MintEvents]);
}
