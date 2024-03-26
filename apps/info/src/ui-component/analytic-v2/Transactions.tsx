import { useState, useMemo } from "react";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Trans, t } from "@lingui/macro";
import { enumToString, shorten, formatAmount, formatDollarAmount } from "@icpswap/utils";
import { Header, HeaderCell, BodyCell, TableRow, SortDirection } from "@icpswap/ui";
import { Transaction } from "types/analytic-v2";
import Pagination from "ui-component/pagination/cus";
import dayjs from "dayjs";
import { Copy, StaticLoading } from "ui-component/index";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      gridTemplateColumns: "1.5fr repeat(5, 1fr)",

      "@media screen and (max-width: 780px)": {
        gridTemplateColumns: "1.5fr repeat(5, 1fr)",
      },
    },
  };
});

export function ActionTypeFormat(transaction: Transaction) {
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
    case "removeLiquidity":
      swapDesc = t`Remove ${transaction.token0Symbol} and  ${transaction.token1Symbol}`;
      break;
    case "collect":
      swapDesc = t`Collect ${transaction.token0Symbol} and  ${transaction.token1Symbol}`;
      break;
    default:
      break;
  }

  return swapDesc;
}

export interface TransactionsProps {
  transactions: Transaction[] | undefined | null;
  loading?: boolean;
  maxItems?: number;
}

export default function Transactions({ transactions, maxItems = 10, loading }: TransactionsProps) {
  const [page, setPage] = useState(1);

  const classes = useStyles();

  const [sortField, setSortField] = useState<string>("timestamp");
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const sortedTransactions = useMemo(() => {
    return transactions
      ? transactions
          .slice()
          .sort((a, b) => {
            if (a && b && !!sortField) {
              const bool =
                a[sortField as keyof Transaction] > b[sortField as keyof Transaction]
                  ? (sortDirection === SortDirection.ASC ? 1 : -1) * 1
                  : (sortDirection === SortDirection.ASC ? 1 : -1) * -1;

              return bool;
            }
            return 0;
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : [];
  }, [transactions, maxItems, page, sortField, sortDirection]);

  const handleSortChange = (sortField: string, sortDirection: SortDirection) => {
    setSortDirection(sortDirection);
    setSortField(sortField);
  };

  return (
    <Box>
      <Header className={classes.wrapper} onSortChange={handleSortChange} defaultSortFiled={sortField}>
        <HeaderCell field="#">
          <Trans>#</Trans>
        </HeaderCell>

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

      {(sortedTransactions ?? []).map((transaction, index) => (
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
            <Copy content={transaction.recipient}>{shorten(transaction.recipient, 8)}</Copy>
          </BodyCell>

          <BodyCell>{dayjs(Number(transaction.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
        </TableRow>
      ))}

      {loading ? <StaticLoading loading={loading} /> : null}

      <Box mt="20px">
        {!loading && !!transactions?.length ? (
          <Pagination maxItems={maxItems} length={transactions?.length ?? 0} onPageChange={setPage} />
        ) : null}
      </Box>
    </Box>
  );
}
