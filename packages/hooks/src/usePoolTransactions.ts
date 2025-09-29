import { useEffect, useMemo, useState } from "react";
import { InfoTransactionResponse, PageResponse, Null } from "@icpswap/types";
import { icpswap_info_fetch_get } from "@icpswap/utils";

export async function getPoolTransactions(poolId: string, page: number, limit: number) {
  const result = await icpswap_info_fetch_get<PageResponse<InfoTransactionResponse>>(`/pool/${poolId}/transaction`, {
    page,
    limit,
  });

  return result?.data;
}

interface UsePoolTransactionsProps {
  poolId: string | Null;
  offset: number;
  limit: number;
  refresh?: number;
  cache?: boolean;
}

export function usePoolTransactions({ poolId, offset, limit, cache, refresh }: UsePoolTransactionsProps) {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<undefined | InfoTransactionResponse[]>(undefined);

  useEffect(() => {
    async function call() {
      if (poolId) {
        if (!cache) {
          setTransactions(undefined);
        }

        setLoading(true);
        const result = await getPoolTransactions(poolId, offset, limit);
        setTransactions(result?.content);
        setLoading(false);
      }
    }
    call();
  }, [cache, poolId, offset, limit, refresh]);

  return useMemo(() => ({ loading, result: transactions }), [loading, transactions]);
}
