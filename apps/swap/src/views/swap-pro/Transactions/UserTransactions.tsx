import { useUserPoolTransactions } from "@icpswap/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";

import Transaction from "./Transactions";

export interface PoolTransactionsProps {
  canisterId: string | undefined;
}

export function UserTransactions({ canisterId }: PoolTransactionsProps) {
  const principal = useAccountPrincipalString();
  const { result: transactions, loading } = useUserPoolTransactions(principal, canisterId, 0, 300);

  return <Transaction transactions={transactions} loading={loading} hasFilter />;
}
