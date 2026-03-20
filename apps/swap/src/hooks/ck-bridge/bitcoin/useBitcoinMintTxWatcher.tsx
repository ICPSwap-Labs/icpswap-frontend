import { useInterval } from "@icpswap/hooks";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useBitcoinTxResponseManager } from "hooks/ck-bridge/bitcoin/useBitcoinTxResponseManager";
import { useBtcMintTransactions } from "hooks/ck-bridge/btc";
import { useCallback, useMemo } from "react";

const INTERVAL_TIME = 10_000;

export function useBitcoinMintTxWatcher() {
  const { result: bitcoinMintTransactions } = useBtcMintTransactions();
  const bitcoinTxManager = useBitcoinTxResponseManager();

  const hashes = useMemo(() => {
    if (isUndefinedOrNull(bitcoinMintTransactions)) return [];
    return bitcoinMintTransactions.map((transaction) => transaction.txid);
  }, [bitcoinMintTransactions]);

  useInterval({
    callback: useCallback(async () => {
      if (hashes.length === 0) return;
      bitcoinTxManager(hashes);
    }, [hashes, bitcoinTxManager]),
    interval: INTERVAL_TIME,
  });
}
