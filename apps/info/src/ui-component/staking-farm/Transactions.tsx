import { useState } from "react";
import { Typography, Table, TableHead, TableCell, TableContainer, TableRow, TableBody } from "@mui/material";
import { pageArgsFormat, enumToString, parseTokenAmount, toSignificant } from "@icpswap/utils";
import { ListLoading, NoData, Pagination, PaginationType } from "ui-component/index";
import { Trans } from "@lingui/macro";
import dayjs from "dayjs";
import AddressFormat from "ui-component/AddressFormat";
import { useV3FarmStakeRecords } from "@icpswap/hooks";
import { type StakingFarmStakeTransaction } from "@icpswap/types";
import upperFirst from "lodash/upperFirst";
import { useTokenInfo } from "hooks/token";

export function PoolItem({
  transactions,
  rewardTokenId,
}: {
  rewardTokenId: string | undefined;
  transactions: StakingFarmStakeTransaction;
}) {
  const { result: token } = useTokenInfo(rewardTokenId);

  const isStaking = enumToString(transactions.transType) === "stake";

  return (
    <TableRow>
      <TableCell>
        <Typography>{dayjs(Number(transactions.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{upperFirst(enumToString(transactions.transType))}</Typography>
      </TableCell>
      <TableCell>
        <AddressFormat address={isStaking ? transactions.from.toString() : transactions.to.toString()} />
      </TableCell>
      <TableCell>
        <Typography sx={{ maxWidth: "200px", wordBreak: "break-word" }}>
          {isStaking
            ? ""
            : toSignificant(parseTokenAmount(transactions.amount, token?.decimals).toString(), 6, {
                groupSeparator: ",",
              })}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export default function Transactions({
  id,
  rewardTokenId,
}: {
  id: string | undefined;
  rewardTokenId: string | undefined;
}) {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useV3FarmStakeRecords(id, offset, pagination.pageSize);
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
              <Trans>Address</Trans>
            </TableCell>
            <TableCell>Reward Amount</TableCell>
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
      {loading || !id ? <ListLoading loading={loading || !id} /> : null}
      {Number(totalElements) > 0 ? (
        <Pagination
          total={Number(totalElements)}
          num={pagination.pageNum}
          onPageChange={handlePageChange}
          defaultPageSize={pagination.pageSize}
        />
      ) : null}
    </TableContainer>
  );
}
