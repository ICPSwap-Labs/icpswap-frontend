import { usePoolTransactions } from "@icpswap/hooks";
import { Null } from "@icpswap/types";

import { Transactions, StyleProps } from "./Transactions";

interface PoolTransactionsProps {
  canisterId: string | Null;
  refresh?: number;
  styleProps?: StyleProps;
}

export function PoolTransactions({ canisterId, styleProps, refresh }: PoolTransactionsProps) {
  const { result: transactions, loading } = usePoolTransactions({
    poolId: canisterId,
    offset: 1,
    limit: 300,
    refresh,
    cache: true,
  });

  return <Transactions transactions={transactions} loading={loading} hasFilter styleProps={styleProps} />;
}
