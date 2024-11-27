import { Box } from "@mui/material";
import { usePoolTransactions } from "@icpswap/hooks";
import Transaction from "./Transactions";

export default function PoolTransactions({ canisterId }: { canisterId: string }) {
  const { result: transactions, loading } = usePoolTransactions(canisterId, 0, 300);

  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Box sx={{ minWidth: "1200px" }}>
        <Transaction transactions={transactions} loading={loading} hasFilter />
      </Box>
    </Box>
  );
}
