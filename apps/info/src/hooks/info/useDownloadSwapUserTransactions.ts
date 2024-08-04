/* eslint-disable no-loop-func */
import { getInfoUserTransactions, useInfoUserStorageIds } from "@icpswap/hooks";
import type { UserStorageTransaction } from "@icpswap/types";
import { useMemo, useState, useCallback } from "react";
import { enumToString, timestampFormat, writeFileOneSheet } from "@icpswap/utils";

const MAX_DOWNLOAD_LENGTH = 10000;

export interface useUserAllSwapTransactionsProps {
  principal: string | undefined;
  pair: string | undefined;
}

export function useDownloadUserTransactions({ principal, pair }: useUserAllSwapTransactionsProps) {
  const [loading, setLoading] = useState(false);

  const { result: storageIds } = useInfoUserStorageIds(principal);

  const download = useCallback(async () => {
    setLoading(true);

    if (!storageIds || !principal) return;

    let transactions: UserStorageTransaction[] = [];

    for (let i = 0; i < storageIds.length; i++) {
      const storageId = storageIds[i];

      let offset = 0;
      const limit = 1000;

      const fetch = async (storageId: string) => {
        const result = await getInfoUserTransactions(storageId, principal, offset, limit, pair ? [pair] : []);
        const _transactions = result.content;

        transactions = transactions.concat(_transactions);

        if (_transactions.length === limit && transactions.length < MAX_DOWNLOAD_LENGTH) {
          offset = limit + offset;
          await fetch(storageId);
        }
      };

      await fetch(storageId);

      if (transactions.length >= MAX_DOWNLOAD_LENGTH) {
        break;
      }
    }

    const downloadData = transactions.map((e) => ({
      ...e,
      action: enumToString(e.action),
      liquidityChange: e.liquidityChange.toString(),
      liquidityTotal: e.liquidityTotal.toString(),
      poolFee: e.poolFee.toString(),
      tick: e.tick.toString(),
      timestamp: e.timestamp.toString(),
      date: timestampFormat(e.timestamp * BigInt(1000)),
    }));

    writeFileOneSheet(downloadData, "swap-scan-transaction-list");

    setLoading(false);
  }, [pair, principal, storageIds]);

  return useMemo(
    () => ({
      loading,
      download,
    }),
    [loading, download],
  );
}
