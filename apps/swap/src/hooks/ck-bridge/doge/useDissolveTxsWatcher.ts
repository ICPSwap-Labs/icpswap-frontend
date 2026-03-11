import { useCallback } from "react";
import { useDogeUnFinalizedDissolveTxs, useDissolveTxManager } from "hooks/ck-bridge/doge/useDissolveTxManager";
import { dogeDissolveState, getDogeHashFromStatus, isDogeDissolveEnded } from "utils/chain-key";
import { useSuccessTip } from "hooks/useTips";
import { useTranslation } from "react-i18next";
import { useInterval, retrieveDogeStatus } from "@icpswap/hooks";
import { DogeDissolveTxState } from "types/chain-key";
import { toHexString } from "@icpswap/utils";

export function useDogeDissolveTxWatcher() {
  const [openTip] = useSuccessTip();
  const txs = useDogeUnFinalizedDissolveTxs();
  const dissolveTxManager = useDissolveTxManager();
  const { t } = useTranslation();

  const callback = useCallback(async () => {
    if (txs && txs.length) {
      for (let i = 0; i < txs.length; i++) {
        const tx = txs[i];

        if (!isDogeDissolveEnded(tx.state)) {
          const dissolveResult = (await retrieveDogeStatus({ block_index: tx.block_index })).data;

          const state = dogeDissolveState(dissolveResult);

          if (state === DogeDissolveTxState.Confirmed) {
            openTip(t("ck.dissolve.completed", { symbol: "DOGE" }));
          }

          const txid = getDogeHashFromStatus(dissolveResult);

          dissolveTxManager({
            ...tx,
            state: dogeDissolveState(dissolveResult),
            txid: tx.txid ?? (txid ? toHexString([...txid].reverse()) : undefined),
          });
        }
      }
    }
  }, [txs, dissolveTxManager]);

  useInterval(callback, 10000);
}
