import { useState, useMemo, useCallback, ReactNode } from "react";
import { BigNumber, enumToString, isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { Header, HeaderCell, SortDirection, TransactionRow, NoData, LoadingRow, Flex } from "@icpswap/ui";
import { InfoTransactionResponse, Null } from "@icpswap/types";
import Pagination from "components/pagination/cus";
import { Box, Typography, useTheme, makeStyles } from "components/Mui";
import { useTips, TIP_SUCCESS } from "hooks/index";
import copyToClipboard from "copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { ValueLabelTooltip } from "components/info/ValueLabelTooltip";

export interface StyleProps {
  padding?: string;
}

const useStyles = (styleProps?: StyleProps) =>
  makeStyles(() => {
    return {
      wrapper: {
        display: "grid",
        gap: "1em",
        padding: styleProps?.padding ?? "16px",
        alignItems: "center",
        gridTemplateColumns: "1.5fr repeat(4, 1fr) 170px",
        "@media screen and (max-width: 780px)": {
          gridTemplateColumns: "1.5fr repeat(4, 1fr) 170px",
          padding: "16px",
        },
      },
    };
  });

export interface TransactionsProps {
  transactions: InfoTransactionResponse[] | Null;
  loading?: boolean;
  maxItems?: number;
  hasFilter?: boolean;
  showedTokens?: string[];
  styleProps?: StyleProps;
  CustomNoData?: ReactNode;
}

type Filter = "all" | "swaps" | "adds" | "removes";

export function Transactions({
  transactions,
  styleProps,
  maxItems = 10,
  loading,
  hasFilter,
  showedTokens,
  CustomNoData,
}: TransactionsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles(styleProps)();
  const [openTip] = useTips();
  const [page, setPage] = useState(1);

  const [sortField, setSortField] = useState<string>("timestamp");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const filteredTransactions = useMemo(() => {
    return transactions
      ? transactions
          .slice()
          .filter((transaction) => {
            const type = enumToString(transaction.actionType);
            if (filter === "swaps") return type === "Swap";
            if (filter === "adds") return type === "IncreaseLiquidity" || type === "AddLiquidity" || type === "Mint";
            if (filter === "removes") return type === "DecreaseLiquidity";
            return true;
          })
          .filter((transaction) => {
            if (!showedTokens) return true;
            return (
              showedTokens?.includes(transaction.token0LedgerId) && showedTokens?.includes(transaction.token1LedgerId)
            );
          })
      : null;
  }, [transactions, filter, showedTokens]);

  const sortedTransactions = useMemo(() => {
    return filteredTransactions
      ? filteredTransactions
          .slice()
          .sort((a, b) => {
            if (a && b && !!sortField) {
              const bool = new BigNumber(a[sortField as keyof InfoTransactionResponse]).isGreaterThan(
                b[sortField as keyof InfoTransactionResponse],
              )
                ? (sortDirection === SortDirection.ASC ? 1 : -1) * 1
                : (sortDirection === SortDirection.ASC ? 1 : -1) * -1;

              return bool;
            }
            return 0;
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : null;
  }, [filteredTransactions, maxItems, page, sortField, sortDirection]);

  const handleSortChange = (sortField: string, sortDirection: SortDirection) => {
    setSortDirection(sortDirection);
    setSortField(sortField);
  };

  const Filters: { key: Filter; value: string }[] = [
    { key: "all", value: "All" },
    { key: "swaps", value: "Swaps" },
    { key: "adds", value: "Adds" },
    { key: "removes", value: "Removes" },
  ];

  const handleFilterChange = (filter: Filter) => {
    setPage(1);
    setFilter(filter);
  };

  const handleCopy = useCallback((address: string) => {
    copyToClipboard(address);
    openTip(t`Copy Success`, TIP_SUCCESS);
  }, []);

  return (
    <>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ minWidth: "1120px" }}>
          <Header
            className={classes.wrapper}
            onSortChange={handleSortChange}
            defaultSortFiled={sortField}
            borderBottom={`1px solid ${theme.palette.border.level1}`}
          >
            <Box>
              {hasFilter ? (
                <Box sx={{ display: "flex", gap: "0 10px" }}>
                  {Filters.map((ele) => (
                    <Typography
                      key={ele.key}
                      sx={{
                        color: filter === ele.key ? "#ffffff" : theme.colors.dark400,
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                      onClick={() => handleFilterChange(ele.key)}
                    >
                      {ele.value}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ color: theme.colors.dark400 }}>#</Typography>
              )}
            </Box>

            <HeaderCell field="token0TxValue" isSort>
              <Flex gap="0 4px">
                <HeaderCell>{t("common.total.value")}</HeaderCell>
                <ValueLabelTooltip />
              </Flex>
            </HeaderCell>

            <HeaderCell field="amountToken0">{t("common.token.amount")}</HeaderCell>

            <HeaderCell field="amountToken1">{t("common.token.amount")}</HeaderCell>

            <HeaderCell field="sender">{t("common.account")}</HeaderCell>

            <HeaderCell field="timestamp" isSort>
              {t("common.time")}
            </HeaderCell>
          </Header>

          {isUndefinedOrNull(sortedTransactions) || loading ? (
            <Box sx={{ padding: "12px" }}>
              <LoadingRow>
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
          ) : sortedTransactions.length === 0 ? (
            CustomNoData ?? <NoData />
          ) : (
            sortedTransactions.map((transaction, index) => (
              <TransactionRow
                key={`${String(transaction.txTime)}_${index}`}
                className={classes.wrapper}
                transaction={transaction}
                onCopy={handleCopy}
              />
            ))
          )}
        </Box>
      </Box>

      {nonUndefinedOrNull(filteredTransactions) && !loading && filteredTransactions.length > 0 ? (
        <Box sx={{ padding: styleProps?.padding ?? "16px" }}>
          <Pagination page={page} maxItems={maxItems} length={filteredTransactions.length} onPageChange={setPage} />
        </Box>
      ) : null}
    </>
  );
}
