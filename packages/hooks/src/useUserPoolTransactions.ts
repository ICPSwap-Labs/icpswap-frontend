import { useEffect, useMemo, useState } from "react";
import { BaseTransaction, Null } from "@icpswap/types";
import { useInfoUserStorageIds, getInfoUserTransactions } from "./info";

export function useUserPoolTransactions(
  principal: string | Null,
  poolId: string | Null,
  offset: number,
  limit: number,
) {
  const { result: storageIds } = useInfoUserStorageIds(principal);

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<undefined | BaseTransaction[]>(undefined);

  useEffect(() => {
    async function call() {
      if (storageIds && poolId) {
        setTransactions(undefined);
        setLoading(true);

        for (let i = 0; i < storageIds.length; i++) {
          const result = await getInfoUserTransactions(storageIds[i], principal, offset, limit, [poolId]);

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
  }, [storageIds, poolId, offset, limit]);

  return useMemo(() => ({ loading, result: transactions }), [loading, transactions]);
}
