import { getInfoUserTransactions, getBaseStorages, getBaseTransactions, useInfoUserStorageIds } from "@icpswap/hooks";
import type { Null, PaginationResult, PoolStorageTransaction } from "@icpswap/types";
import { useEffect, useMemo, useState } from "react";

export interface useUserAllSwapTransactionsProps {
  principal: string | Null;
  pair: string | Null;
  offset: number;
  limit: number;
}

export function useSwapTransactions({ principal, pair, offset, limit }: useUserAllSwapTransactionsProps) {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<null | PaginationResult<PoolStorageTransaction> | undefined>(null);
  const [baseTransactions, setBaseTransactions] = useState<null | PaginationResult<PoolStorageTransaction> | undefined>(
    null,
  );

  const { result: storageIds, loading: getStorageIdsLoading } = useInfoUserStorageIds(principal);

  useEffect(() => {
    async function call() {
      if (principal) {
        if (storageIds && storageIds.length > 0) {
          setTransactions(null);
          setLoading(true);

          const storageId = storageIds[0];
          const transactions = await getInfoUserTransactions(storageId, principal, offset, limit, pair ? [pair] : []);

          setLoading(false);

          setTransactions(transactions);
        }
      } else {
        setBaseTransactions(null);
        setLoading(true);

        const storageIds = await getBaseStorages();

        if (!storageIds) {
          setBaseTransactions(null);
          setLoading(false);
          return;
        }

        const storageId = storageIds[0];

        const transactions = await getBaseTransactions(storageId, offset, limit, pair ? [pair] : []);

        setLoading(false);
        setBaseTransactions(transactions);
      }
    }

    call();
  }, [storageIds, principal, pair, offset, limit]);

  return useMemo(
    () => ({
      loading: loading || getStorageIdsLoading,
      result: principal ? transactions : baseTransactions,
    }),
    [loading, transactions, getStorageIdsLoading, principal, baseTransactions],
  );
}
