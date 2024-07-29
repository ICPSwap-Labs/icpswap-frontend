import { useState, useMemo } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Trans, t } from "@lingui/macro";
import { enumToString, shorten, formatDollarAmount, formatAmount } from "@icpswap/utils";
import {
  Header,
  HeaderCell,
  TableRow,
  BodyCell,
  SortDirection,
  LoadingRow,
  NoData,
  SimplePagination,
} from "@icpswap/ui";
import { PoolStorageTransaction } from "@icpswap/types";
import dayjs from "dayjs";
import { Copy } from "components/index";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      gridTemplateColumns: "1.5fr repeat(5, 1fr)",
    },
  };
});

export function ActionTypeFormat(transaction: PoolStorageTransaction) {
  const type = enumToString(transaction.action);

  let swapDesc = "";

  switch (type) {
    case "swap":
      swapDesc = t`Swap ${transaction.token0Symbol} for ${transaction.token1Symbol}`;
      break;
    case "increaseLiquidity":
    case "addLiquidity":
    case "mint":
      swapDesc = t`Add ${transaction.token0Symbol} and ${transaction.token1Symbol}`;
      break;
    case "decreaseLiquidity":
      swapDesc = t`Remove ${transaction.token0Symbol} and  ${transaction.token1Symbol}`;
      break;
    case "claim":
      swapDesc = t`Collect ${transaction.token0Symbol} and  ${transaction.token1Symbol}`;
      break;
    default:
      break;
  }

  return swapDesc;
}

export interface TransactionsProps {
  transactions: PoolStorageTransaction[] | undefined | null;
  loading?: boolean;
  maxItems?: number;
  hasFilter?: boolean;
  showedTokens?: string[];
}

type Filter = "all" | "swaps" | "adds" | "removes";

export default function Transactions({
  transactions,
  maxItems = 10,
  loading,
  hasFilter,
  showedTokens,
}: TransactionsProps) {
  const theme = useTheme() as Theme;
  const [page, setPage] = useState(1);

  const classes = useStyles();

  const [sortField, setSortField] = useState<string>("timestamp");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const filteredTransactions = useMemo(() => {
    return transactions
      ? transactions
          .slice()
          .filter((ele) => {
            const type = enumToString(ele.action);
            if (filter === "swaps") return type === "swap";
            if (filter === "adds") return type === "increaseLiquidity" || type === "addLiquidity" || type === "mint";
            if (filter === "removes") return type === "decreaseLiquidity";
            return true;
          })
          .filter((ele) => {
            if (!showedTokens) return true;
            return showedTokens?.includes(ele.token0Id) && showedTokens?.includes(ele.token1Id);
          })
      : [];
  }, [transactions, filter, showedTokens]);

  const sortedTransactions = useMemo(() => {
    return filteredTransactions
      ? filteredTransactions
          .slice()
          .sort((a, b) => {
            if (a && b && !!sortField) {
              const bool =
                a[sortField as keyof PoolStorageTransaction] > b[sortField as keyof PoolStorageTransaction]
                  ? (sortDirection === SortDirection.ASC ? 1 : -1) * 1
                  : (sortDirection === SortDirection.ASC ? 1 : -1) * -1;

              return bool;
            }
            return 0;
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : [];
  }, [filteredTransactions, maxItems, page, sortField, sortDirection]);

  const handleSortChange = (sortField: string, sortDirection: SortDirection) => {
    setSortDirection(sortDirection);
    setSortField(sortField);
  };

  const handleFilterChange = (filter: Filter) => {
    setPage(1);
    setFilter(filter);
  };

  const Filters: { key: Filter; value: string }[] = [
    { key: "all", value: "All" },
    { key: "swaps", value: "Swaps" },
    { key: "adds", value: "Adds" },
    { key: "removes", value: "Removes" },
  ];

  return (
    <Box>
      <Header className={classes.wrapper} onSortChange={handleSortChange} defaultSortFiled={sortField}>
        <Box>
          {hasFilter ? (
            <Box sx={{ display: "flex", gap: "0 10px" }}>
              {Filters.map((ele) => (
                <Typography
                  key={ele.key}
                  sx={{
                    color: filter === ele.key ? "#ffffff" : theme.colors.darkPrimary400,
                    cursor: "pointer",
                    fontSize: "16px",
                    "@media(max-width: 640px)": {
                      fontSize: "12px",
                    },
                  }}
                  onClick={() => handleFilterChange(ele.key)}
                >
                  {ele.value}
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography sx={{ color: theme.colors.darkPrimary400 }}>#</Typography>
          )}
        </Box>

        <HeaderCell field="amountUSD" isSort>
          <Trans>Total Value</Trans>
        </HeaderCell>

        <HeaderCell field="amountToken0" isSort>
          <Trans>Token Amount</Trans>
        </HeaderCell>

        <HeaderCell field="amountToken1" isSort>
          <Trans>Token Amount</Trans>
        </HeaderCell>

        <HeaderCell field="sender" isSort>
          <Trans>Account</Trans>
        </HeaderCell>

        <HeaderCell field="timestamp" isSort>
          <Trans>Time</Trans>
        </HeaderCell>
      </Header>

      {!loading
        ? (sortedTransactions ?? []).map((transaction, index) => (
            <TableRow key={`${String(transaction.timestamp)}_${index}`} className={classes.wrapper}>
              <BodyCell>{ActionTypeFormat(transaction)}</BodyCell>

              <BodyCell>{formatDollarAmount(transaction.amountUSD, 3)}</BodyCell>

              <BodyCell>
                {formatAmount(transaction.token0ChangeAmount, 6)} {transaction.token0Symbol}
              </BodyCell>

              <BodyCell>
                {formatAmount(transaction.token1ChangeAmount, 6)} {transaction.token1Symbol}
              </BodyCell>

              <BodyCell>
                <Copy content={transaction.recipient}>
                  <BodyCell color="primary.main">{shorten(transaction.recipient, 8)}</BodyCell>
                </Copy>
              </BodyCell>

              <BodyCell>{dayjs(Number(transaction.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
            </TableRow>
          ))
        : null}

      {(sortedTransactions ?? []).length === 0 && !loading ? <NoData /> : null}

      {loading ? (
        <Box sx={{ padding: "24px" }}>
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
      ) : null}

      <Box mt="20px">
        {!loading && !!filteredTransactions?.length ? (
          <SimplePagination
            page={page}
            maxItems={maxItems}
            length={filteredTransactions?.length ?? 0}
            onPageChange={setPage}
          />
        ) : null}
      </Box>
    </Box>
  );
}
