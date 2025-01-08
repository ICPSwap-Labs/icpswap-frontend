import { useState } from "react";
import { Table, TableHead, TableCell, TableContainer, TableRow, TableBody } from "@mui/material";
import { parseTokenAmount, pageArgsFormat } from "@icpswap/utils";
import dayjs from "dayjs";
import { Trans } from "@lingui/macro";
import { ListLoading, PaginationType, AddressFormat } from "components/index";
import { useV3FarmDistributeRecords } from "@icpswap/hooks";
import type { StakingFarmDistributeTransaction } from "@icpswap/types";
import { useToken } from "hooks/index";
import { HeaderCell, BodyCell, Pagination, NoData } from "@icpswap/ui";

interface PoolItemProps {
  rewardTokenId: string | undefined;
  transactions: StakingFarmDistributeTransaction;
}

function PoolItem({ transactions, rewardTokenId }: PoolItemProps) {
  const [, rewardToken] = useToken(rewardTokenId);

  return (
    <TableRow>
      <TableCell>
        <BodyCell>{dayjs(Number(transactions.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell>{`${parseTokenAmount(transactions.rewardGained, rewardToken?.decimals).toFormat()} ${
          rewardToken?.symbol ?? "--"
        }`}</BodyCell>
      </TableCell>
      <TableCell>
        <AddressFormat address={transactions.owner.toString()} sx={{ fontSize: "16px" }} />
      </TableCell>
    </TableRow>
  );
}

interface FarmClaimTransactionsProps {
  id: string | undefined;
  rewardTokenId: string | undefined;
}

export function FarmClaimTransactions({ id, rewardTokenId }: FarmClaimTransactionsProps) {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);
  const { result, loading } = useV3FarmDistributeRecords(id, offset, pagination.pageSize);
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
              <PoolItem key={index} transactions={transactions} rewardTokenId={rewardTokenId} />
            ))}
        </TableBody>
      </Table>
      {list.length === 0 && !loading && !!id ? <NoData /> : null}
      {loading || !id ? <ListLoading loading={loading} /> : null}
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
