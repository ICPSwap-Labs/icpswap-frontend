import { useTokenTransactions } from "hooks/info/swap";
import { Null } from "@icpswap/types";

import { Transactions, StyleProps } from "./Transactions";

interface TokenTransactionsProps {
  canisterId: string | Null;
  styleProps?: StyleProps;
}

export function TokenTransactions({ canisterId, styleProps }: TokenTransactionsProps) {
  const { result: transactions, loading } = useTokenTransactions(canisterId, 0, 300);

  return <Transactions transactions={transactions} loading={loading} hasFilter styleProps={styleProps} />;
}
