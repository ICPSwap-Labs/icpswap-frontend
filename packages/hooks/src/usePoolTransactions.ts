import { useEffect, useMemo, useState } from "react";
import { BaseTransaction } from "@icpswap/types";
import { getTransactionsByPool, useBaseStorages } from "./info";

export function usePoolTransactions(poolId: string | undefined, offset: number, limit: number, refresh?: number) {
  const { result: storageIds } = useBaseStorages();

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<undefined | BaseTransaction[]>(undefined);

  useEffect(() => {
    async function call() {
      if (storageIds && poolId) {
        setTransactions(undefined);
        setLoading(true);

        for (let i = 0; i < storageIds.length; i++) {
          const result = await getTransactionsByPool(storageIds[i], offset, limit, poolId);

          if (result) {
            setTransactions((prevState) => [...result.content, ...(prevState ?? [])]);
            if (result.content.length === limit) {
              break;
            }
          } else {
            await call();
          }
        }

        setLoading(false);
      }
    }

    call();
  }, [storageIds, poolId, offset, limit, refresh]);

  return useMemo(() => ({ loading, result: transactions }), [loading, transactions]);
}
