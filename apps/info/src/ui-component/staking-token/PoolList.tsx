import { useState } from "react";
import { Grid, Table, TableHead, TableCell, TableContainer, TableRow, TableBody, Box, Link } from "@mui/material";
import { Trans } from "@lingui/macro";
import { getTokenPoolStatus, POOL_STATUS_COLORS } from "utils/farms/index";
import dayjs from "dayjs";
import { useStakingPools, useStakingPoolState } from "@icpswap/hooks";
import { pageArgsFormat, explorerLink } from "@icpswap/utils";
import { TextButton, Pagination, NoData, ListLoading, PaginationType } from "ui-component/index";
import { type StakingPoolControllerPoolInfo } from "@icpswap/types";
import { HeaderCell, BodyCell } from "@icpswap/ui";
import upperFirst from "lodash/upperFirst";

export function PoolItem({ pool }: { pool: StakingPoolControllerPoolInfo }) {
  const { status } = getTokenPoolStatus(pool) ?? { status: "" };
  const state = useStakingPoolState(pool);

  return (
    <TableRow>
      <TableCell>
        <Link href={explorerLink(pool.canisterId.toString())} target="_blank" sx={{ fontSize: "16px" }}>
          {pool.canisterId.toString()}
        </Link>
      </TableCell>
      <TableCell>
        <BodyCell>{dayjs(Number(pool.startTime) * 1000).format("YYYY-MM-DD HH:mm")}</BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell>{dayjs(Number(pool.bonusEndTime) * 1000).format("YYYY-MM-DD HH:mm")}</BodyCell>
      </TableCell>
      <TableCell>
        <Link href={explorerLink(pool.stakingToken.address)} target="_blank" sx={{ fontSize: "16px" }}>
          {pool.stakingTokenSymbol}
        </Link>
      </TableCell>
      <TableCell>
        <Link href={explorerLink(pool.rewardToken.address)} target="_blank" sx={{ fontSize: "16px" }}>
          {pool.rewardTokenSymbol}
        </Link>
      </TableCell>
      <TableCell>
        <Grid container alignItems="center">
          <Box
            sx={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: POOL_STATUS_COLORS[status],
              marginRight: "8px",
            }}
          />
          <BodyCell
            sx={{
              color: POOL_STATUS_COLORS[status],
            }}
          >
            {state ? (state === "NOT_STARTED" ? "Unstart" : upperFirst(state.toLocaleLowerCase())) : "--"}
          </BodyCell>
        </Grid>
      </TableCell>
      <TableCell>
        <TextButton to={`/stake/details/${pool.canisterId}`} sx={{ fontSize: "16px" }}>
          <Trans>Details</Trans>
        </TextButton>
      </TableCell>
    </TableRow>
  );
}

export default function PoolList() {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useStakingPools(undefined, offset, pagination.pageSize);
  const { content = [], totalElements = 0 } = result ?? { content: [], totalElements: 0 };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <TableContainer className={loading ? "with-loading" : ""}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <HeaderCell>
                <Trans>Canister ID</Trans>
              </HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>
                <Trans>Start Time</Trans>
              </HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>
                <Trans>End Time</Trans>
              </HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>
                <Trans>Staking Token</Trans>
              </HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>
                <Trans>Reward Token</Trans>
              </HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>
                <Trans>Status</Trans>
              </HeaderCell>
            </TableCell>
            <TableCell>&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {content.map((pool) => (
            <PoolItem key={pool.canisterId.toString()} pool={pool} />
          ))}
        </TableBody>
      </Table>
      {content.length === 0 && !loading ? <NoData /> : null}
      {loading ? <ListLoading loading={loading} /> : null}
      {Number(totalElements) > 0 ? (
        <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={handlePageChange} />
      ) : null}
    </TableContainer>
  );
}
