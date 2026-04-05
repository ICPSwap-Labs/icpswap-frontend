import { useUserLimitTransactions, useUserUnusedBalance } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { useMemo } from "react";
import { useAccountPrincipal } from "store/auth/hooks";

import { HistoryTableProUI } from "./HistoryTableProUI";

export interface HistoryTableProProps {
  wrapperClassName?: string;
  poolId: string | Null;
}

export function HistoryTablePro({ poolId, wrapperClassName }: HistoryTableProProps) {
  const principal = useAccountPrincipal();

  const { data: limitTransactionsResult, isLoading: loading } = useUserLimitTransactions(principal?.toString(), 1, 100);
  const { data: unusedBalance } = useUserUnusedBalance(poolId, principal);

  const limitTransactions = useMemo(() => {
    return limitTransactionsResult?.content;
  }, [limitTransactionsResult]);

  return (
    <HistoryTableProUI
      poolId={poolId}
      wrapperClassName={wrapperClassName}
      loading={loading}
      limitTransactions={limitTransactions}
      unusedBalance={unusedBalance}
    />
  );
}
