import { useUserPoolTransactions } from "@icpswap/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { Null } from "@icpswap/types";

import { Transactions, StyleProps } from "./Transactions";

export interface UserTransactionsProps {
  canisterId: string | undefined;
  styleProps?: StyleProps;
  refresh?: number;
}

export function UserTransactions({ canisterId, styleProps }: UserTransactionsProps) {
  const principal = useAccountPrincipalString();
  const { result: transactions, loading } = useUserPoolTransactions(principal, canisterId, 0, 300);

  return <Transactions transactions={transactions} loading={loading} hasFilter styleProps={styleProps} />;
}
