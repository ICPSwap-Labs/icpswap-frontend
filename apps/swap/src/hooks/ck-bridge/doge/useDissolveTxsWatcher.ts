import { retrieveDogeStatus, useInterval } from "@icpswap/hooks";
import { toHexString } from "@icpswap/utils";
import { useDissolveTxManager, useDogeUnFinalizedDissolveTxs } from "hooks/ck-bridge/doge/useDissolveTxManager";
import { useSuccessTip } from "hooks/useTips";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { DogeDissolveTxState } from "types/chain-key";
import { dogeDissolveState, getDogeHashFromStatus, isDogeDissolveEnded } from "utils/chain-key";

export function useDogeDissolveTxWatcher() {
  const [openTip] = useSuccessTip();
  const txs = useDogeUnFinalizedDissolveTxs();
  const dissolveTxManager = useDissolveTxManager();
  const { t } = useTranslation();

  const callback = useCallback(async () => {
    if (txs?.length) {
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
  }, [txs, dissolveTxManager, openTip, t]);

  useInterval({ callback, interval: 10_000 });
}
