import { useCallback } from "react";
import { chainKeyETHMinter } from "@icpswap/actor";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useEthDissolveTxs, useUpdateEthDissolveTx } from "store/web3/hooks";
import { MINTER_ID } from "constants/ckETH";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { useSuccessTip } from "hooks/useTips";
import { useTranslation } from "react-i18next";
import { useInterval } from "@icpswap/hooks";
import { isEthereumDissolveTxEnd, isTxFinalizedByStatus } from "utils/chain-key/ethereum";

const INTERVAL = 10_000;

export function useEthDissolveTxWatcher() {
  const principal = useAccountPrincipalString();
  const txs = useEthDissolveTxs();
  const updateEthDissolveTx = useUpdateEthDissolveTx();
  const [openTip] = useSuccessTip();
  const { t } = useTranslation();

  const callback = useCallback(async () => {
    if (txs && txs.length && nonUndefinedOrNull(principal)) {
      for (let i = 0; i < txs.length; i++) {
        const tx = txs[i];
        const block_index = BigInt(tx.block_index);

        if (!isEthereumDissolveTxEnd(tx)) {
          const res = await (await chainKeyETHMinter(MINTER_ID)).retrieve_eth_status(block_index);

          if (isTxFinalizedByStatus(res)) {
            openTip(t("ck.dissolve.completed", { symbol: "ETH" }));
          }

          updateEthDissolveTx(principal, block_index, res, undefined);
        }
      }
    }
  }, [JSON.stringify(txs), principal, openTip]);

  useInterval({ callback, interval: INTERVAL });
}
