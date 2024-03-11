import { getTransactionsByToken, useBaseStorages } from "@icpswap/hooks";
import { useEffect, useMemo, useState } from "react";
import { Transaction } from "types/info";

export function useTokenTransactions(tokenId: string | undefined, offset: number, limit: number) {
  const { result: storageIds } = useBaseStorages();

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<undefined | Transaction[]>(undefined);

  useEffect(() => {
    async function call() {
      if (storageIds && tokenId) {
        setLoading(true);

        for (let i = 0; i < storageIds.length; i++) {
          const result = await getTransactionsByToken(storageIds[i], offset, limit, tokenId);

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
  }, [storageIds, tokenId, offset, limit]);

  return useMemo(() => ({ loading, result: transactions }), [loading, transactions]);
}
