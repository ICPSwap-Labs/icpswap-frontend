import { useEffect } from "react";
import { ckBtcMinter } from "actor/ckBTC";
import { useBTCDissolveUnFinalizedTxs, useUpdateUserBTCTx } from "store/wallet/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { TxState } from "types/ckBTC";

export function isEndedState(state: TxState) {
  return !(state !== "Confirmed" && state !== "AmountTooLow");
}

export function useBtcDissolveTxWatcher() {
  const principal = useAccountPrincipalString();
  const txs = useBTCDissolveUnFinalizedTxs();
  const updateBTCTx = useUpdateUserBTCTx();

  useEffect(() => {
    async function call() {
      if (txs && txs.length && !!principal) {
        for (let i = 0; i < txs.length; i++) {
          const block_index = BigInt(txs[i].block_index);
          const { state } = txs[i];
          if (!isEndedState(state)) {
            const dissolveResult = await (await ckBtcMinter()).retrieve_btc_status({ block_index });
            updateBTCTx(principal, block_index, dissolveResult, undefined);
          }
        }
      }
    }

    const timer = setInterval(() => {
      call();
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, [txs, principal, updateBTCTx]);
}
