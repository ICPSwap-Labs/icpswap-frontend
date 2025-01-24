import { useUserPoolTransactions } from "@icpswap/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { Null } from "@icpswap/types";

import { Transactions, StyleProps } from "./Transactions";

export interface UserTransactionsProps {
  poolId: string | Null;
  styleProps?: StyleProps;
  refresh?: number;
}

export function UserTransactions({ poolId, styleProps }: UserTransactionsProps) {
  const principal = useAccountPrincipalString();
  const { result: transactions, loading } = useUserPoolTransactions(principal, poolId, 0, 300);

  return <Transactions transactions={transactions} loading={loading} hasFilter styleProps={styleProps} />;
}
