import { usePoolTransactions } from "@icpswap/hooks";

import Transaction from "./Transactions";

export interface PoolTransactionsProps {
  canisterId: string | undefined;
  refresh?: number;
}

export function PoolTransactions({ canisterId, refresh }: PoolTransactionsProps) {
  const { result: transactions, loading } = usePoolTransactions(canisterId, 0, 300, refresh);

  return <Transaction transactions={transactions} loading={loading} hasFilter />;
}
