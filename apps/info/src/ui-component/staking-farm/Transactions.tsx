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
import { HeaderCell, BodyCell } from "@icpswap/ui";

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
        <BodyCell>{dayjs(Number(transactions.timestamp) * 1000).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell>{upperFirst(enumToString(transactions.transType))}</BodyCell>
      </TableCell>
      <TableCell>
        <AddressFormat
          address={isStaking ? transactions.from.toString() : transactions.to.toString()}
          sx={{ fontSize: "16px" }}
        />
      </TableCell>
      <TableCell>
        <BodyCell sx={{ maxWidth: "200px", wordBreak: "break-word" }}>
          {isStaking
            ? ""
            : toSignificant(parseTokenAmount(transactions.amount, token?.decimals).toString(), 6, {
                groupSeparator: ",",
              })}
        </BodyCell>
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
              <HeaderCell>
                <Trans>Time</Trans>
              </HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>
                <Trans>Type</Trans>
              </HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>
                <Trans>Address</Trans>
              </HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>
                <Trans>Reward Amount</Trans>
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
