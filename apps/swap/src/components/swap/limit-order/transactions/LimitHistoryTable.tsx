import { useMemo } from "react";
import { Null } from "@icpswap/types";
import { useUserLimitTransactions } from "@icpswap/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";

import { LimitOrdersTableUI } from "./LimitHistoryTableUI";

export interface LimitHistoryTableProps {
  wrapperClassName?: string;
  poolId: string | Null;
}

export function LimitHistoryTable({ poolId, wrapperClassName }: LimitHistoryTableProps) {
  const principal = useAccountPrincipalString();

  const start_time = useMemo(() => {
    const now = parseInt(String(new Date().getTime() / 1000));
    return now - 60 * 24 * 3600;
  }, []);

  const { result: limitTransactionsResult, loading } = useUserLimitTransactions(principal, start_time, 0, 100);

  const limitTransactions = useMemo(() => {
    return limitTransactionsResult?.records;
  }, [limitTransactionsResult]);

  return (
    <LimitOrdersTableUI
      poolId={poolId}
      wrapperClassName={wrapperClassName}
      loading={loading}
      limitTransactions={limitTransactions}
    />
  );
}
