import { useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getExplorerPrincipalLink } from "utils/index";
import { parseTokenAmount, pageArgsFormat } from "@icpswap/utils";
import { Trans } from "@lingui/macro";
import { getFarmPoolStatus, POOL_STATUS_COLORS } from "utils/farms/index";
import dayjs from "dayjs";
import { useTokenInfo } from "hooks/token/index";
import { feeAmountToPercentage } from "utils/swap/index";
import { NoData, LoadingRow, Pagination, TextButton, PaginationType } from "ui-component/index";
import type { StakingFarmInfo } from "@icpswap/types";
import { useSwapPoolMetadata, useV3StakingFarms } from "@icpswap/hooks";
import { useFarmUSDValue } from "hooks/staking-farm";
import { Header, HeaderCell, Row, BodyCell } from "ui-component/Table";

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

export function PoolItem({ farm }: { farm: StakingFarmInfo }) {
  const classes = useStyles();
  const { status, statusText } = getFarmPoolStatus(farm) ?? { status: "", statusText: "" };

  const { result: swapPool } = useSwapPoolMetadata(farm.pool);
  const { result: token0 } = useTokenInfo(swapPool?.token0.address);
  const { result: token1 } = useTokenInfo(swapPool?.token1.address);

  const { poolTVL } = useFarmUSDValue(farm);

  return (
    <Row className={classes.wrapper}>
      <BodyCell>
        {token0 && token1 ? (
          <TextButton link={getExplorerPrincipalLink(farm.pool)}>{`${token0.symbol}/${
            token1.symbol
          }/${feeAmountToPercentage(Number(farm.poolFee))}`}</TextButton>
        ) : (
          "--"
        )}
      </BodyCell>
      <BodyCell>{dayjs(Number(farm.startTime) * 1000).format("YYYY-MM-DD HH:mm")}</BodyCell>
      <BodyCell>{dayjs(Number(farm.endTime) * 1000).format("YYYY-MM-DD HH:mm")}</BodyCell>
      <BodyCell>
        <BodyCell>{String(farm.numberOfStakes)}</BodyCell>
        <BodyCell sub>~${poolTVL}</BodyCell>
      </BodyCell>
      <BodyCell>
        {`${parseTokenAmount(farm.totalReward, farm.rewardTokenDecimals).toFormat()} ${farm.rewardTokenSymbol}`}
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
        <TextButton to={`/staking-farm/details/${farm.farmCid}`}>
          <Trans>Details</Trans>
        </TextButton>
      </BodyCell>
    </Row>
  );
}

export default function PoolList() {
  const classes = useStyles();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);
  const { result, loading } = useV3StakingFarms(offset, pagination.pageSize, "all");
  const { content = [], totalElements = 0 } = result ?? { content: [], totalElements: 0 };

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

      {content.map((farm) => (
        <PoolItem key={farm.farmCid} farm={farm} />
      ))}

      {content.length === 0 && !loading ? <NoData /> : null}

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

      {Number(totalElements) > 0 ? (
        <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={handlePageChange} />
      ) : null}
    </Box>
  );
}
