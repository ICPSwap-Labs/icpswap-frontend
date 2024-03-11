import { useState } from "react";
import { Typography, Table, TableHead, TableCell, TableContainer, TableRow, TableBody } from "@mui/material";
import { parseTokenAmount, pageArgsFormat } from "@icpswap/utils";
import dayjs from "dayjs";
import { Trans } from "@lingui/macro";
import AddressFormat from "ui-component/AddressFormat";
import { Pagination, ListLoading, NoData, PaginationType } from "ui-component/index";
import { useV3FarmDistributeRecords } from "@icpswap/hooks";
import type { StakingFarmDistributeTransaction } from "@icpswap/types";
import { useTokenInfo } from "hooks/token";

export function PoolItem({
  transactions,
  rewardTokenId,
}: {
  rewardTokenId: string | undefined;
  transactions: StakingFarmDistributeTransaction;
}) {
  const { result: rewardToken } = useTokenInfo(rewardTokenId);

  return (
    <TableRow>
      <TableCell>
        <Typography>{dayjs(Number(transactions.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{`${parseTokenAmount(transactions.rewardGained, rewardToken?.decimals).toFormat()} ${
          rewardToken?.symbol ?? "--"
        }`}</Typography>
      </TableCell>
      <TableCell>
        <AddressFormat address={transactions.owner.toString()} />
      </TableCell>
    </TableRow>
  );
}

export default function ClaimRecords({
  id,
  rewardTokenId,
}: {
  id: string | undefined;
  rewardTokenId: string | undefined;
}) {
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
