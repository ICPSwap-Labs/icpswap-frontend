import { useSwapFailedTransactions as useSwapFailedTransactionsCall } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { BigNumber, isUndefinedOrNull, nanosecond2Millisecond } from "@icpswap/utils";
import { useEffect, useMemo, useState } from "react";
import { swapTransactionActionFormat } from "utils/transaction";

export interface SwapFailedTransactionTipsProps {
  onCheckChange: (checked: boolean) => void;
  ui?: "pro";
  poolId?: string | Null;
  updateNeedCheckOrNot: (checked: boolean) => void;
}

export const useSwapFailedTransactions = (poolId: string | Null) => {
  const [symbol, setSymbol] = useState<string | undefined>(undefined);
  const [transactions, setTransactions] = useState<Array<bigint>>([]);

  const { data: swapFailedTransactions } = useSwapFailedTransactionsCall(poolId);

  useEffect(() => {
    async function call() {
      if (isUndefinedOrNull(swapFailedTransactions) || swapFailedTransactions.length === 0) {
        setSymbol(undefined);
        setTransactions([]);
        return;
      }

      const failedFTransactionsWithMessage = await Promise.all(
        swapFailedTransactions.map(async ([index, transaction]) => {
          const { message, tokens } = await swapTransactionActionFormat(transaction.action);
          return {
            index,
            message,
            tokens,
            time: transaction.timestamp,
          };
        }),
      );

      // Only the message includes "is out of cycles" can be trigger the error tips
      // And the time must after 2025/07/20
      const outOfCyclesFailedTransactions = failedFTransactionsWithMessage.filter(({ message, time }) => {
        if (!message) return false;
        return (
          message.includes("out of cycles") &&
          new BigNumber(nanosecond2Millisecond(time)).isGreaterThan(new Date("2025-07-20T08:00:00").getTime())
        );
      });

      if (outOfCyclesFailedTransactions.length === 0) return;

      const failedTransaction = outOfCyclesFailedTransactions[0];
      const tokens = failedTransaction.tokens;
      const tokenSymbol = tokens[0].symbol;
      const transactions = outOfCyclesFailedTransactions.map(({ index }) => index);

      setSymbol(tokenSymbol);
      setTransactions(transactions);
    }

    call();
  }, [swapFailedTransactions]);

  return useMemo(() => ({ transactions, symbol }), [transactions, symbol]);
};
