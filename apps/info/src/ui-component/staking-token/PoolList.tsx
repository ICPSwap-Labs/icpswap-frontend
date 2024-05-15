import { useState } from "react";
import {
  Grid,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  Box,
  Link,
} from "@mui/material";
import { Trans } from "@lingui/macro";
import { getTokenPoolStatus, POOL_STATUS_COLORS } from "utils/farms/index";
import dayjs from "dayjs";
import { useStakingPools } from "@icpswap/hooks";
import { pageArgsFormat, explorerLink } from "@icpswap/utils";
import { TextButton, Pagination, NoData, ListLoading, PaginationType } from "ui-component/index";
import { type StakingPoolControllerPoolInfo } from "@icpswap/types";

export function PoolItem({ pool }: { pool: StakingPoolControllerPoolInfo }) {
  const { status, statusText } = getTokenPoolStatus(pool) ?? { status: "", statusText: "" };

  return (
    <TableRow>
      <TableCell>
        <TextButton link={explorerLink(pool.canisterId.toString())}>{pool.canisterId.toString()}</TextButton>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: "16px" }} color="text.primary">
          {dayjs(Number(pool.startTime) * 1000).format("YYYY-MM-DD HH:mm")}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: "16px" }} color="text.primary">
          {dayjs(Number(pool.bonusEndTime) * 1000).format("YYYY-MM-DD HH:mm")}
        </Typography>
      </TableCell>
      <TableCell>
        <Link href={explorerLink(pool.stakingToken.address)} target="_blank">
          {pool.stakingTokenSymbol}
        </Link>
      </TableCell>
      <TableCell>
        <Link href={explorerLink(pool.rewardToken.address)} target="_blank">
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
          <Typography
            sx={{
              fontSize: "16px",
              color: POOL_STATUS_COLORS[status],
            }}
          >
            {statusText}
          </Typography>
        </Grid>
      </TableCell>
      <TableCell>
        <TextButton to={`/staking-token/details/${pool.canisterId}/${statusText}`} sx={{ fontSize: "16px" }}>
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
              <Typography sx={{ fontSize: "16px" }}>
                <Trans>Canister ID</Trans>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontSize: "16px" }}>
                <Trans>Start Time</Trans>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontSize: "16px" }}>
                <Trans>End Time</Trans>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontSize: "16px" }}>
                <Trans>Staking Token</Trans>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontSize: "16px" }}>
                <Trans>Reward Token</Trans>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontSize: "16px" }}>
                <Trans>Status</Trans>
              </Typography>
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
