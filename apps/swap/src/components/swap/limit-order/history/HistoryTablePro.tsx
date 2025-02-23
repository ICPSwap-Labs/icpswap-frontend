import { useMemo } from "react";
import { Null } from "@icpswap/types";
import { useUserLimitTransactions, useUserUnusedBalance } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";

import { HistoryTableProUI } from "./HistoryTableProUI";

export interface HistoryTableProProps {
  wrapperClassName?: string;
  poolId: string | Null;
}

export function HistoryTablePro({ poolId, wrapperClassName }: HistoryTableProProps) {
  const principal = useAccountPrincipal();

  const start_time = useMemo(() => {
    const now = parseInt(String(new Date().getTime() / 1000));
    return now - 60 * 24 * 3600;
  }, []);

  const { result: limitTransactionsResult, loading } = useUserLimitTransactions(
    principal?.toString(),
    start_time,
    0,
    100,
  );
  const { result: unusedBalance } = useUserUnusedBalance(poolId, principal);

  const limitTransactions = useMemo(() => {
    return limitTransactionsResult?.records;
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
