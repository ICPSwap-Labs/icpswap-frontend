import { usePoolTransactions } from "@icpswap/hooks";
import { Null } from "@icpswap/types";

import { Transactions, StyleProps } from "./Transactions";

interface PoolTransactionsProps {
  canisterId: string | Null;
  refresh?: number;
  styleProps?: StyleProps;
}

export function PoolTransactions({ canisterId, styleProps, refresh }: PoolTransactionsProps) {
  const { result: transactions, loading } = usePoolTransactions(canisterId, 0, 300, refresh);

  return <Transactions transactions={transactions} loading={loading} hasFilter styleProps={styleProps} />;
}
