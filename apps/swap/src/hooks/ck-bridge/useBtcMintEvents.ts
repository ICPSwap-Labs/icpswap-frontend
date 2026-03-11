import { useMemo } from "react";
import { isUndefinedOrNull } from "@icpswap/utils";
import { BitcoinTransactionEvent } from "types/web3";
import { ckBTC } from "@icpswap/tokens";
import { useBtcDepositAddress, useBtcMintUnconfirmedTransactions } from "hooks/ck-bridge/btc";
import { getBitcoinAmountFromTrans } from "utils/web3/ck-bridge";
import { BridgeChainType, BridgeType } from "@icpswap/constants/dist/constants";

export function useBtcMintEvents() {
  const bitcoinMintTransactions = useBtcMintUnconfirmedTransactions();
  const { result: address } = useBtcDepositAddress();

  const btcMintEvents: BitcoinTransactionEvent[] = useMemo(() => {
    if (isUndefinedOrNull(bitcoinMintTransactions) || isUndefinedOrNull(address)) return [];

    return bitcoinMintTransactions.map((tx) => {
      return {
        hash: tx.txid,
        amount: getBitcoinAmountFromTrans(tx, address)?.toString() ?? "",
        type: BridgeType.mint,
        chain: BridgeChainType.btc,
        token: ckBTC.address,
      };
    });
  }, [bitcoinMintTransactions, address]);

  return useMemo(() => btcMintEvents, [btcMintEvents]);
}
