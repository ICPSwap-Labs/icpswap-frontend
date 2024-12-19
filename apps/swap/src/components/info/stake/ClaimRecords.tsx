import { useState } from "react";
import { Table, TableHead, TableCell, TableContainer, TableRow, TableBody } from "@mui/material";
import { parseTokenAmount, pageArgsFormat } from "@icpswap/utils";
import { Trans } from "@lingui/macro";
import dayjs from "dayjs";
import { useStakingPoolClaimTransactions } from "@icpswap/hooks";
import { ListLoading, PaginationType, AddressFormat } from "components/index";
import { type StakingPoolTransaction } from "@icpswap/types";
import { HeaderCell, BodyCell, Pagination, NoData } from "@icpswap/ui";

function PoolItem({ transactions }: { transactions: StakingPoolTransaction }) {
  return (
    <TableRow>
      <TableCell>
        <BodyCell>{dayjs(Number(transactions.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell>{`${parseTokenAmount(transactions.amount, Number(transactions.rewardTokenDecimals)).toFormat()} ${
          transactions.rewardTokenSymbol
        }`}</BodyCell>
      </TableCell>
      <TableCell>
        <AddressFormat address={transactions.to.toString()} sx={{ fontSize: "16px" }} />
      </TableCell>
    </TableRow>
  );
}

export function StakeClaimTransactions({ id }: { id: string | undefined }) {
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
              <HeaderCell>
                <Trans>Time</Trans>
              </HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>
                <Trans>Token Amount</Trans>
              </HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>
                <Trans>Address</Trans>
              </HeaderCell>
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
