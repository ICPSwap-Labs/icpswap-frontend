import { useMemo, useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getExplorerPrincipalLink } from "utils/index";
import { parseTokenAmount, pageArgsFormat } from "@icpswap/utils";
import { Trans } from "@lingui/macro";
import { getFarmPoolStatus, POOL_STATUS_COLORS } from "utils/farms/index";
import dayjs from "dayjs";
import { useTokenInfo } from "hooks/token/index";
import { feeAmountToPercentage } from "utils/swap/index";
import { LoadingRow, TextButton, PaginationType } from "ui-component/index";
import type { FarmTvl } from "@icpswap/types";
import { useFarmInfo, useSwapPoolMetadata, useFarms } from "@icpswap/hooks";
import { useFarmUSDValue } from "hooks/staking-farm";
import { Header, HeaderCell, TableRow, BodyCell, NoData } from "@icpswap/ui";
import { Principal } from "@dfinity/principal";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr) 140px 120px",
      padding: "16px",
      alignItems: "center",
      minWidth: "1200px",
    },
  };
});

export interface PoolItemProps {
  farmTVL: [Principal, FarmTvl];
}

export function PoolItem({ farmTVL }: PoolItemProps) {
  const classes = useStyles();

  const { farmId } = useMemo(() => {
    return { farmId: farmTVL[0].toString() };
  }, [farmTVL]);

  const { result: farmInfo, loading } = useFarmInfo(farmId);
  const { status, statusText } = getFarmPoolStatus(farmInfo) ?? { status: "", statusText: "" };
  const { result: swapPool } = useSwapPoolMetadata(farmInfo?.pool.toString());
  const { result: token0 } = useTokenInfo(swapPool?.token0.address);
  const { result: token1 } = useTokenInfo(swapPool?.token1.address);
  const { result: rewardToken } = useTokenInfo(farmInfo?.rewardToken.address);

  const { poolTVL } = useFarmUSDValue(farmId);

  return loading ? (
    <LoadingRow>
      <div />
      <div />
      <div />
      <div />
    </LoadingRow>
  ) : (
    <TableRow className={classes.wrapper}>
      <BodyCell>
        {token0 && token1 && farmInfo ? (
          <TextButton link={getExplorerPrincipalLink(farmInfo.pool.toString())}>{`${token0.symbol}/${
            token1.symbol
          }/${feeAmountToPercentage(Number(farmInfo.poolFee))}`}</TextButton>
        ) : (
          "--"
        )}
      </BodyCell>
      <BodyCell>{dayjs(Number(farmInfo?.startTime) * 1000).format("YYYY-MM-DD HH:mm")}</BodyCell>
      <BodyCell>{dayjs(Number(farmInfo?.endTime) * 1000).format("YYYY-MM-DD HH:mm")}</BodyCell>
      <BodyCell>
        <BodyCell>{String(farmInfo?.numberOfStakes)}</BodyCell>
        <BodyCell sub>~${poolTVL}</BodyCell>
      </BodyCell>
      <BodyCell>
        {`${parseTokenAmount(farmInfo?.totalReward, rewardToken?.decimals).toFormat()} ${rewardToken?.symbol}`}
      </BodyCell>
      <BodyCell>
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
              color: POOL_STATUS_COLORS[status],
            }}
          >
            {statusText}
          </Typography>
        </Grid>
      </BodyCell>
      <BodyCell>
        <TextButton to={`/staking-farm/details/${farmId}`}>
          <Trans>Details</Trans>
        </TextButton>
      </BodyCell>
    </TableRow>
  );
}

export default function PoolList() {
  const classes = useStyles();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);
  const { result, loading } = useFarms(undefined);

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <Box sx={{ overflow: "auto" }}>
      <Header className={classes.wrapper}>
        <HeaderCell>
          <Trans>Pool</Trans>
        </HeaderCell>
        <HeaderCell>
          <Trans>Start Time</Trans>
        </HeaderCell>
        <HeaderCell>
          <Trans>End Time</Trans>
        </HeaderCell>
        <HeaderCell>
          <Trans>Position Amount</Trans>
        </HeaderCell>
        <HeaderCell>
          <Trans>Reward Amount</Trans>
        </HeaderCell>
        <HeaderCell>
          <Trans>Status</Trans>
        </HeaderCell>
        <HeaderCell>&nbsp;</HeaderCell>
      </Header>

      {result?.map((farm) => <PoolItem key={farm[0].toString()} farmTVL={farm} />)}

      {result?.length === 0 && !loading ? <NoData /> : null}

      {loading ? (
        <LoadingRow>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </LoadingRow>
      ) : null}

      {/* {Number(totalElements) > 0 ? (
        <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={handlePageChange} />
      ) : null} */}
    </Box>
  );
}
