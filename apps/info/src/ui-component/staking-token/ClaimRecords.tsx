import { useState } from "react";
import { Typography, Table, TableHead, TableCell, TableContainer, TableRow, TableBody } from "@mui/material";
import { parseTokenAmount, pageArgsFormat } from "@icpswap/utils";
import { Trans } from "@lingui/macro";
import dayjs from "dayjs";
import AddressFormat from "ui-component/AddressFormat";
import { useStakingPoolClaimTransactions } from "@icpswap/hooks";
import { NoData, ListLoading, Pagination, PaginationType } from "ui-component/index";
import { type StakingPoolTransaction } from "@icpswap/types";

export function PoolItem({ transactions }: { transactions: StakingPoolTransaction }) {
  return (
    <TableRow>
      <TableCell>
        <Typography>{dayjs(Number(transactions.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{`${parseTokenAmount(transactions.amount, Number(transactions.rewardTokenDecimals)).toFormat()} ${
          transactions.rewardTokenSymbol
        }`}</Typography>
      </TableCell>
      <TableCell>
        <AddressFormat address={transactions.to.toString()} />
      </TableCell>
    </TableRow>
  );
}

export default function ClaimRecords({ id }: { id: string | undefined }) {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useStakingPoolClaimTransactions(id, undefined, offset, pagination.pageSize);
  const { content: list, totalElements = 0 } = result ?? { totalElements: 0, content: [] };

  const handlePageChange = (value: PaginationType) => {
    setPagination(value);
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
              <Trans>Token Amount</Trans>
            </TableCell>
            <TableCell>
              <Trans>Address</Trans>
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
        <Pagination
          total={Number(totalElements)}
          onPageChange={handlePageChange}
          num={pagination.pageNum}
          defaultPageSize={pagination.pageSize}
        />
      ) : null}
    </TableContainer>
  );
}
