import { useState } from "react";
import { Typography, Table, TableHead, TableCell, TableContainer, TableRow, TableBody } from "@mui/material";
import { Trans } from "@lingui/macro";
import { PaginationType, Pagination, NoData, ListLoading, AddressFormat } from "ui-component/index";
import dayjs from "dayjs";
import { useStakingPoolTransactions } from "@icpswap/hooks";
import { parseTokenAmount, enumToString, pageArgsFormat } from "@icpswap/utils";
import { StakingPoolTransaction } from "@icpswap/types";
import upperFirst from "lodash/upperFirst";

export function PoolItem({ transactions }: { transactions: StakingPoolTransaction }) {
  return (
    <TableRow>
      <TableCell>
        <Typography>{dayjs(Number(transactions.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{upperFirst(enumToString(transactions.transType))}</Typography>
      </TableCell>
      <TableCell>
        <AddressFormat address={transactions.from.toString()} />
      </TableCell>
      <TableCell>
        <AddressFormat address={transactions.to.toString()} />
      </TableCell>
      <TableCell>
        <Typography color="text.primary">{`${parseTokenAmount(
          transactions.amount,
          transactions.stakingTokenDecimals,
        ).toFormat()} ${transactions.stakingTokenSymbol}`}</Typography>
      </TableCell>
    </TableRow>
  );
}

export interface TransactionsProps {
  id: string | undefined;
}

export default function Transactions({ id }: TransactionsProps) {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useStakingPoolTransactions(id, undefined, offset, pagination.pageSize);
  const { content: list, totalElements = 0 } = result ?? { totalElements: 0, content: [] };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <TableContainer className={loading || !id ? "with-loading" : ""}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Trans>Time</Trans>
            </TableCell>
            <TableCell>
              <Trans>Type</Trans>
            </TableCell>
            <TableCell>
              <Trans>From</Trans>
            </TableCell>
            <TableCell>
              <Trans>To</Trans>
            </TableCell>
            <TableCell>
              <Trans>Amount</Trans>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list
            .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
            .map((transactions, index) => (
              <PoolItem key={index} transactions={transactions} />
            ))}
        </TableBody>
      </Table>
      {list.length === 0 && !loading && !!id ? <NoData /> : null}
      {loading || !id ? <ListLoading loading={loading || !id} /> : null}
      {Number(totalElements) > 0 ? (
        <Pagination total={Number(totalElements)} onPageChange={handlePageChange} num={pagination.pageNum} />
      ) : null}
    </TableContainer>
  );
}
