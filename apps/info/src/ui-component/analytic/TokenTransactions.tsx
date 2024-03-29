import { Box } from "@mui/material";
import { useTokenTransactions } from "hooks/info/useTokenTransactions";
import Transaction from "./Transactions";

export default function TokenTransactions({ canisterId }: { canisterId: string }) {
  const { result: transactions, loading } = useTokenTransactions(canisterId, 0, 300);

  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Box sx={{ minWidth: "1200px" }}>
        <Transaction transactions={transactions} loading={loading} hasFilter />
      </Box>
    </Box>
  );
}
