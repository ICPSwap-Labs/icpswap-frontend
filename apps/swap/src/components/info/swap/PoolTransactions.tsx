import { Box } from "components/Mui";
import { usePoolTransactions } from "@icpswap/hooks";

import { Transactions } from "./Transactions";

export function PoolTransactions({ canisterId }: { canisterId: string }) {
  const { result: transactions, loading } = usePoolTransactions(canisterId, 0, 300);

  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Box sx={{ minWidth: "1152px" }}>
        <Transactions transactions={transactions} loading={loading} hasFilter />
      </Box>
    </Box>
  );
}
