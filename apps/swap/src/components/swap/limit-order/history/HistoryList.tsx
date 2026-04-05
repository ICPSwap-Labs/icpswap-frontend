import { useUserLimitTransactions } from "@icpswap/hooks";
import { Flex, LoadingRow } from "@icpswap/ui";
import { Box, makeStyles } from "components/Mui";
import { useScrollToTop } from "hooks/useScrollToTop";
import { useMemo } from "react";
import { useAccountPrincipal } from "store/auth/hooks";
import { LimitTransactionsEmpty } from "../Empty";
import { HistoryHeader } from "./HistoryHeader";
import { HistoryRow } from "./HistoryRow";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr) 120px",
    },
  };
});

export function HistoryList() {
  const classes = useStyles();
  const principal = useAccountPrincipal();

  const { data: limitTransactionsResult, isLoading: loading } = useUserLimitTransactions(principal?.toString(), 1, 100);

  const limitTransactions = useMemo(() => {
    return limitTransactionsResult?.content;
  }, [limitTransactionsResult]);

  const scrollToTop = useScrollToTop();

  return (
    <>
      {loading ? (
        <Box sx={{ padding: "8px" }}>
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
        <Flex fullWidth justify="center">
          <LimitTransactionsEmpty onClick={scrollToTop} />
        </Flex>
      ) : (
        <Box sx={{ width: "100%", minWidth: "1058px" }}>
          <HistoryHeader wrapperClasses={classes.wrapper} />
          <Flex vertical align="flex-start" fullWidth gap="8px 0">
            {limitTransactions.map((transaction, index) => (
              <HistoryRow key={index} transaction={transaction} wrapperClasses={classes.wrapper} />
            ))}
          </Flex>
        </Box>
      )}
    </>
  );
}
