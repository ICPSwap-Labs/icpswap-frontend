import { useMemo } from "react";
import { Flex, LoadingRow, NoData } from "@icpswap/ui";
import { useUserLimitTransactions } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { Trans } from "@lingui/macro";
import { Box, Typography } from "components/Mui";

import { LimitTransactionCard } from "./LimitTransaction";

export function LimitHistory() {
  const principal = useAccountPrincipal();

  const start_time = useMemo(() => {
    const now = parseInt(String(new Date().getTime() / 1000));
    return now - 60 * 24 * 3600;
  }, []);

  const { result: limitTransactionsResult, loading } = useUserLimitTransactions(
    principal?.toString(),
    start_time,
    0,
    100,
  );

  const limitTransactions = useMemo(() => {
    return limitTransactionsResult?.records;
  }, [limitTransactionsResult]);

  return (
    <>
      <Typography sx={{ margin: "16px 0 0 0" }}>
        <Trans>Show Only the Last 6 Months of Records</Trans>
      </Typography>

      {loading ? (
        <Box>
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        </Box>
      ) : !limitTransactions || limitTransactions.length === 0 ? (
        <NoData />
      ) : (
        <Flex vertical align="flex-start" fullWidth gap="6px 0" sx={{ margin: "16px 0 0 0" }}>
          {limitTransactions.map((transaction, index) => (
            <LimitTransactionCard key={index} transaction={transaction} />
          ))}
        </Flex>
      )}
    </>
  );
}
