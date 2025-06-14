import { useTokenTransactions } from "@icpswap/hooks";
import { Null } from "@icpswap/types";
import { Transactions, StyleProps } from "components/info/swap/Transactions";

interface TokenTransactionsProps {
  canisterId: string | Null;
  styleProps?: StyleProps;
}

export function TokenTransactions({ canisterId, styleProps }: TokenTransactionsProps) {
  const { result, loading } = useTokenTransactions(canisterId, 0, 300);

  return <Transactions transactions={result?.content} loading={loading} hasFilter styleProps={styleProps} />;
}
