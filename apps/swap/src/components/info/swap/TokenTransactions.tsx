import { Box } from "@mui/material";
import { useTokenTransactions } from "hooks/info/swap";

import { Transactions } from "./Transactions";

export function TokenTransactions({ canisterId }: { canisterId: string }) {
  const { result: transactions, loading } = useTokenTransactions(canisterId, 0, 300);

  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Box sx={{ minWidth: "1152px" }}>
        <Transactions transactions={transactions} loading={loading} hasFilter />
      </Box>
    </Box>
  );
}
