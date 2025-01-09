import { useUserPoolTransactions } from "@icpswap/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";

import { Transactions, StyleProps } from "./Transactions";

export interface UserTransactionsProps {
  poolId: string | undefined;
  styleProps?: StyleProps;
  refresh?: number;
}

export function UserTransactions({ poolId, styleProps }: UserTransactionsProps) {
  const principal = useAccountPrincipalString();
  const { result: transactions, loading } = useUserPoolTransactions(principal, poolId, 0, 300);

  return <Transactions transactions={transactions} loading={loading} hasFilter styleProps={styleProps} />;
}
