import { useEffect, useMemo, useState } from "react";
import { BaseTransaction, Null } from "@icpswap/types";
import { getTransactionsByPool, useBaseStorages } from "./info";

interface UsePoolTransactionsProps {
  poolId: string | Null;
  offset: number;
  limit: number;
  refresh?: number;
  cache?: boolean;
}

export function usePoolTransactions({ poolId, offset, limit, cache, refresh }: UsePoolTransactionsProps) {
  const { result: storageIds } = useBaseStorages();

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<undefined | BaseTransaction[]>(undefined);

  useEffect(() => {
    async function call() {
      if (storageIds && poolId) {
        if (!cache) {
          setTransactions(undefined);
        }

        setLoading(true);

        let transactions: BaseTransaction[] = [];

        for (let i = 0; i < storageIds.length; i++) {
          const result = await getTransactionsByPool(storageIds[i], offset, limit, poolId);

          if (result) {
            transactions = transactions.concat(result.content);

            if (result.content.length === limit) {
              break;
            }
          } else {
            await call();
          }
        }

        setTransactions(transactions);
        setLoading(false);
      }
    }

    call();
  }, [storageIds, cache, poolId, offset, limit, refresh]);

  return useMemo(() => ({ loading, result: transactions }), [loading, transactions]);
}
