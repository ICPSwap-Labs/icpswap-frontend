import { useEffect, useMemo } from "react";
import { useSuccessTip } from "hooks/useTips";
import { useBtcMintTransactions } from "hooks/ck-bridge/btc";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useBitcoinTxResponseManager } from "hooks/ck-bridge/bitcoin/useBitcoinTxResponseManager";

const INTERVAL_TIME = 10000;

export function useBitcoinMintTxWatcher() {
  const [openTip] = useSuccessTip();
  const { result: bitcoinMintTransactions } = useBtcMintTransactions();
  const bitcoinTxManager = useBitcoinTxResponseManager();

  const hashes = useMemo(() => {
    if (isUndefinedOrNull(bitcoinMintTransactions)) return [];
    return bitcoinMintTransactions.map((transaction) => transaction.txid);
  }, [bitcoinMintTransactions]);

  useEffect(() => {
    async function call() {
      if (hashes.length === 0) return;
      bitcoinTxManager(hashes);
    }

    const timer = setInterval(() => {
      call();
    }, INTERVAL_TIME);

    call();

    return () => {
      clearInterval(timer);
    };
  }, [hashes, bitcoinTxManager, openTip]);
}
