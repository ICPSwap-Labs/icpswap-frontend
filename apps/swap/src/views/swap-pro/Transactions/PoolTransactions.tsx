import { Box } from "@mui/material";
import { usePoolTransactions } from "@icpswap/hooks";
import Transaction from "./Transactions";

export interface PoolTransactionsProps {
  canisterId: string | undefined;
}

export function PoolTransactions({ canisterId }: PoolTransactionsProps) {
  const { result: transactions, loading } = usePoolTransactions(canisterId, 0, 300);

  return (
    <Box sx={{ width: "100%", padding: "0 16px", overflow: "auto" }}>
      <Box sx={{ minWidth: "1026px" }}>
        <Transaction transactions={transactions} loading={loading} hasFilter />
      </Box>
    </Box>
  );
}
