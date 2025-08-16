import { useCallback } from "react";
import { useSuccessTip } from "hooks/useTips";
import { getBtcTransactionResponse, useBitcoinBlockNumber } from "hooks/ck-bridge/btc";
import { useBitcoinFinalizedTxsManager, useUpdateBitcoinTxResponse } from "store/web3/hooks";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { BITCOIN_CONFIRMATIONS } from "constants/ckBTC";
import { useTranslation } from "react-i18next";

export function useBitcoinTxResponseManager() {
  const { t } = useTranslation();
  const [openTip] = useSuccessTip();
  const blockNumber = useBitcoinBlockNumber();
  const updateBitcoinTxResponse = useUpdateBitcoinTxResponse();
  const [bitcoinFinalizedTxs, bitcoinFinalizedTxsManager] = useBitcoinFinalizedTxsManager();

  return useCallback(
    async (hashes: string[]) => {
      if (isUndefinedOrNull(blockNumber)) return;

      for (let i = 0; i < hashes.length; i++) {
        const hash = hashes[i];

        if (hash && !bitcoinFinalizedTxs.includes(hash)) {
          const transactionResponse = await getBtcTransactionResponse(hash);

          if (transactionResponse && transactionResponse.block_height) {
            if (new BigNumber(blockNumber).minus(transactionResponse.block_height).isEqualTo(BITCOIN_CONFIRMATIONS)) {
              openTip(t("ck.mint.completed", { symbol: "BTC" }));
              bitcoinFinalizedTxsManager([hash]);
            }

            // store the finalized txs
            if (
              new BigNumber(blockNumber).minus(transactionResponse.block_height).isGreaterThan(BITCOIN_CONFIRMATIONS)
            ) {
              bitcoinFinalizedTxsManager([hash]);
            }

            updateBitcoinTxResponse(hash, transactionResponse);
          }
        }
      }
    },
    [blockNumber, bitcoinFinalizedTxs],
  );
}
