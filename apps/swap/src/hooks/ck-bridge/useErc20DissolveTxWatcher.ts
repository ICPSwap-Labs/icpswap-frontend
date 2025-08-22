import { useEffect } from "react";
import { useErc20DissolveTxs } from "hooks/ck-bridge/useErc20DissolveTxs";
import { isErc20Finalized } from "utils/web3/dissolve";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { useSuccessTip } from "hooks/useTips";
import { useTranslation } from "react-i18next";
import { useErc20DissolveCompletedTxsManager } from "store/web3/hooks";

export function useErc20DissolveTxWatcher() {
  const { result: erc20DissolveTxs } = useErc20DissolveTxs();
  const [openTip] = useSuccessTip();
  const { t } = useTranslation();

  const [erc20DissolveCompletedTxs, erc20DissolveCompletedTxsManager] = useErc20DissolveCompletedTxsManager();

  useEffect(() => {
    async function call() {
      if (nonUndefinedOrNull(erc20DissolveTxs) && erc20DissolveTxs.length > 0) {
        for (let i = 0; i < erc20DissolveTxs.length; i++) {
          const tx = erc20DissolveTxs[i];
          const withdrawal_id = tx.withdrawal_id;

          if (isErc20Finalized(tx.status) && !erc20DissolveCompletedTxs.includes(withdrawal_id.toString())) {
            openTip(t("ck.dissolve.completed", { symbol: tx.token_symbol.replace("ck", "") }));
            erc20DissolveCompletedTxsManager([withdrawal_id.toString()]);
          }
        }
      }
    }

    call();
  }, [erc20DissolveTxs, erc20DissolveCompletedTxs]);
}
