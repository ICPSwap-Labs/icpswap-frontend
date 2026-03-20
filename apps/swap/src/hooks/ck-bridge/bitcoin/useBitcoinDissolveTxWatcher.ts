import { ckBtcMinter } from "@icpswap/actor";
import { useInterval } from "@icpswap/hooks";
import { useSuccessTip } from "hooks/useTips";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useBitcoinDissolveTxsManager, useBTCDissolveUnFinalizedTxs } from "store/wallet/hooks";
import {
  bitcoinBytesToHexString,
  bitcoinDissolveState,
  getBitcoinTxFromStatus,
  isBitcoinDissolveEnded,
} from "utils/web3/ck-bridge";

export function useBitcoinDissolveTxWatcher() {
  const [openTip] = useSuccessTip();
  const txs = useBTCDissolveUnFinalizedTxs();
  const bitcoinDissolveTxManager = useBitcoinDissolveTxsManager();
  const { t } = useTranslation();

  const callback = useCallback(async () => {
    if (txs && txs.length) {
      for (let i = 0; i < txs.length; i++) {
        const tx = txs[i];
        const block_index = BigInt(tx.block_index);

        if (!isBitcoinDissolveEnded(tx.state)) {
          const dissolveResult = await (await ckBtcMinter()).retrieve_btc_status({ block_index });

          if (bitcoinDissolveState(dissolveResult) === "Confirmed") {
            openTip(t("ck.dissolve.completed", { symbol: "BTC" }));
          }

          const txid = getBitcoinTxFromStatus(dissolveResult);

          bitcoinDissolveTxManager({
            ...tx,
            state: bitcoinDissolveState(dissolveResult),
            txid: tx.txid ?? (txid ? bitcoinBytesToHexString([...txid].reverse()) : undefined),
          });
        }
      }
    }
  }, [txs, bitcoinDissolveTxManager]);

  useInterval({ callback, interval: 10_000 });
}
