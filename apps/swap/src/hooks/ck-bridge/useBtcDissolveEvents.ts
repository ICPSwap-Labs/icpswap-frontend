import { BridgeChainType, BridgeType } from "@icpswap/constants/dist/constants";
import { ckBTC } from "@icpswap/tokens";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useMemo } from "react";
import { useBTCDissolveUnFinalizedTxs } from "store/wallet/hooks";
import type { BitcoinTransactionEvent } from "types/web3";

export function useBtcDissolveEvents() {
  const btcDissolveTxs = useBTCDissolveUnFinalizedTxs();

  const btcDissolveEvents: BitcoinTransactionEvent[] = useMemo(() => {
    if (isUndefinedOrNull(btcDissolveTxs)) return [];

    return btcDissolveTxs.map((tx) => {
      return {
        hash: tx.txid,
        amount: tx.value,
        type: BridgeType.dissolve,
        chain: BridgeChainType.btc,
        token: ckBTC.address,
      };
    });
  }, [btcDissolveTxs]);

  return useMemo(() => btcDissolveEvents, [btcDissolveEvents]);
}
