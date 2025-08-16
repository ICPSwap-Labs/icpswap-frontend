import { useEffect } from "react";
import { chainKeyETHMinter } from "@icpswap/actor";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useEthDissolveTxs, useUpdateEthDissolveTx } from "store/web3/hooks";
import { MINTER_ID } from "constants/ckETH";
import { DissolveTx } from "types/ckETH";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { useSuccessTip } from "hooks/useTips";
import { isTxFinalized } from "utils/web3/dissolve";
import { useTranslation } from "react-i18next";

const INTERVAL = 10000;

function isEnded(tx: DissolveTx) {
  return tx.state === "TxFinalized";
}

export function useEthDissolveTxWatcher() {
  const principal = useAccountPrincipalString();
  const txs = useEthDissolveTxs();
  const updateEthDissolveTx = useUpdateEthDissolveTx();
  const [openTip] = useSuccessTip();
  const { t } = useTranslation();

  useEffect(() => {
    async function call() {
      if (txs && txs.length && nonUndefinedOrNull(principal)) {
        for (let i = 0; i < txs.length; i++) {
          const tx = txs[i];
          const block_index = BigInt(tx.block_index);

          if (!isEnded(tx)) {
            const res = await (await chainKeyETHMinter(MINTER_ID)).retrieve_eth_status(block_index);

            if (isTxFinalized(res)) {
              openTip(t("ck.dissolve.completed", "ETH"));
            }

            updateEthDissolveTx(principal, block_index, res, undefined);
          }
        }
      }
    }

    const timer = setInterval(() => {
      call();
    }, INTERVAL);

    call();

    return () => {
      clearInterval(timer);
    };
  }, [txs, principal, openTip]);
}
