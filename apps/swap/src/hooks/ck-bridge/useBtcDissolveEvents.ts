import { useMemo } from "react";
import { isUndefinedOrNull } from "@icpswap/utils";
import { BitcoinTransactionEvent } from "types/web3";
import { useBTCDissolveUnFinalizedTxs } from "store/wallet/hooks";
import { ckBTC } from "@icpswap/tokens";

export function useBtcDissolveEvents() {
  const btcDissolveTxs = useBTCDissolveUnFinalizedTxs();

  const btcDissolveEvents: BitcoinTransactionEvent[] = useMemo(() => {
    if (isUndefinedOrNull(btcDissolveTxs)) return [];

    return btcDissolveTxs.map((tx) => {
      return {
        hash: tx.txid,
        amount: tx.value,
        type: "dissolve",
        chain: "btc",
        token: ckBTC.address,
      };
    });
  }, [btcDissolveTxs]);

  return useMemo(() => btcDissolveEvents, [btcDissolveEvents]);
}
