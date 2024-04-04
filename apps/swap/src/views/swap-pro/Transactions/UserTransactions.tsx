import { Box } from "@mui/material";
import { useUserPoolTransactions } from "@icpswap/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";

import Transaction from "./Transactions";

export interface PoolTransactionsProps {
  canisterId: string | undefined;
}

export function UserTransactions({ canisterId }: PoolTransactionsProps) {
  const principal = useAccountPrincipalString();
  const { result: transactions, loading } = useUserPoolTransactions(principal, canisterId, 0, 300);

  return (
    <Box sx={{ width: "100%", padding: "0 16px", overflow: "auto" }}>
      <Box sx={{ minWidth: "1026px" }}>
        <Transaction transactions={transactions} loading={loading} hasFilter />
      </Box>
    </Box>
  );
}
