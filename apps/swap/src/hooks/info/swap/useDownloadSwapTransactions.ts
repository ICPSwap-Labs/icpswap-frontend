/* eslint-disable no-loop-func */
import { getSwapTransactions, getLimitedInfinityCallV1 } from "@icpswap/hooks";
import type { Null, InfoTransactionResponse } from "@icpswap/types";
import { useMemo, useState, useCallback } from "react";
import { BigNumber, enumToString, timestampFormat, writeFileOneSheet } from "@icpswap/utils";

export function getSwapDetails(transaction: InfoTransactionResponse) {
  const type = enumToString(transaction.actionType);

  const token0Amount = new BigNumber(transaction.token0AmountIn).isEqualTo(0)
    ? transaction.token0AmountOut
    : transaction.token0AmountIn;

  const token1Amount = new BigNumber(transaction.token1AmountIn).isEqualTo(0)
    ? transaction.token1AmountOut
    : transaction.token1AmountIn;

  switch (type) {
    case "Swap":
      return `${token0Amount} ${transaction.token0Symbol} → ${token1Amount} ${transaction.token1Symbol}`;

    case "IncreaseLiquidity":
    case "AddLiquidity":
    case "Mint":
    case "DecreaseLiquidity":
    case "Claim":
      return `${token0Amount} ${transaction.token0Symbol} + ${token1Amount} ${transaction.token1Symbol}`;

    default:
      return null;
  }
}

export interface useUserAllSwapTransactionsProps {
  principal: string | Null;
  pair: string | Null;
}

export function useDownloadSwapTransactions() {
  const [loading, setLoading] = useState(false);

  const download = useCallback(async ({ principal, pair }: useUserAllSwapTransactionsProps) => {
    setLoading(true);

    const fetch = async (page: number, limit: number) => {
      const result = await getSwapTransactions({
        principal,
        page,
        limit,
        poolId: pair,
      });

      return result.content;
    };

    const allTransactions = await getLimitedInfinityCallV1<InfoTransactionResponse>(fetch, 5000);

    const downloadData = allTransactions.map((transaction) => {
      const token0Amount = new BigNumber(transaction.token0AmountIn).isEqualTo(0)
        ? transaction.token0AmountOut
        : transaction.token0AmountIn;

      const token1Amount = new BigNumber(transaction.token1AmountIn).isEqualTo(0)
        ? transaction.token1AmountOut
        : transaction.token1AmountIn;

      return {
        Timestamp: timestampFormat(transaction.txTime),
        "User Principal":
          transaction.fromPrincipalId === transaction.poolId ? transaction.toPrincipalId : transaction.fromPrincipalId,
        "Pool CanisterID": transaction.poolId,
        "Action Type": transaction.actionType,
        Details: getSwapDetails(transaction),
        Pair: `${transaction.token0Symbol}/${transaction.token1Symbol}`,
        "From Token": transaction.token0Symbol,
        "From Amount": token0Amount,
        "To Token": transaction.token1Symbol,
        "To Amount": token1Amount,
        "From Token Price": transaction.token0Price,
        "To Token Price": transaction.token1Price,
        "Trade Value(USD)":
          transaction.actionType === "Swap"
            ? transaction.token0TxValue
            : new BigNumber(transaction.token0TxValue).plus(transaction.token1TxValue).toString(),
      };
    });

    writeFileOneSheet(downloadData, "swap-scan-transaction-list");

    setLoading(false);
  }, []);

  return useMemo(
    () => ({
      loading,
      download,
    }),
    [loading, download],
  );
}
