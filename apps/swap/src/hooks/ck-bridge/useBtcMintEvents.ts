import { useMemo } from "react";
import { isUndefinedOrNull } from "@icpswap/utils";
import { BitcoinTransactionEvent } from "types/web3";
import { ckBTC } from "@icpswap/tokens";
import { useBtcDepositAddress, useBtcMintUnconfirmedTransactions } from "hooks/ck-bridge/btc";
import { getBitcoinAmountFromTrans } from "utils/web3/ck-bridge";

export function useBtcMintEvents() {
  const btcMintTxs = useBtcMintUnconfirmedTransactions();
  const { result: address } = useBtcDepositAddress();

  const btcMintEvents: BitcoinTransactionEvent[] = useMemo(() => {
    if (isUndefinedOrNull(btcMintTxs) || isUndefinedOrNull(address)) return [];

    return btcMintTxs.map((tx) => {
      return {
        hash: tx.txid,
        amount: getBitcoinAmountFromTrans(tx, address).toString(),
        type: "mint",
        chain: "btc",
        token: ckBTC.address,
      };
    });
  }, [btcMintTxs, address]);

  return useMemo(() => btcMintEvents, [btcMintEvents]);
}
