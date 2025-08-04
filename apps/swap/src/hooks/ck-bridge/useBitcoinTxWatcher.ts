import { useEffect, useMemo } from "react";
import { useSuccessTip } from "hooks/useTips";
import {
  useBtcUnconfirmedDissolveHashes,
  getBtcTransactionResponse,
  useBtcUnconfirmedMintHashes,
} from "hooks/ck-bridge/btc";
import { useUpdateBitcoinTxResponse } from "store/web3/hooks";

const INTERVAL_TIME = 20000;

export function useBitcoinTxWatcher() {
  const [openTip] = useSuccessTip();

  const btcUnconfirmedDissolveHashes = useBtcUnconfirmedDissolveHashes();
  const btcUnconfirmedMintHashes = useBtcUnconfirmedMintHashes();
  const updateBitcoinTxResponse = useUpdateBitcoinTxResponse();

  const hashes = useMemo(() => {
    return [...btcUnconfirmedDissolveHashes, ...btcUnconfirmedMintHashes];
  }, [btcUnconfirmedDissolveHashes, btcUnconfirmedMintHashes]);

  useEffect(() => {
    async function call() {
      if (hashes.length === 0) return;

      for (let i = 0; i < hashes.length; i++) {
        const hash = hashes[i];
        const transactionResponse = await getBtcTransactionResponse(hash);

        if (transactionResponse) {
          updateBitcoinTxResponse(hash, transactionResponse);
        }
      }
    }

    const timer = setInterval(() => {
      call();
    }, INTERVAL_TIME);

    call();

    return () => {
      clearInterval(timer);
    };
  }, [hashes, openTip]);
}
