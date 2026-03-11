import { useMemo } from "react";
import { isUndefinedOrNull } from "@icpswap/utils";
import { BitcoinTransactionEvent } from "types/web3";
import { useBTCDissolveUnFinalizedTxs } from "store/wallet/hooks";
import { ckBTC } from "@icpswap/tokens";
import { BridgeChainType, BridgeType } from "@icpswap/constants/dist/constants";

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
