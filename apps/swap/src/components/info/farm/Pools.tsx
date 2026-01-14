import { useState, useMemo } from "react";
import { Grid, Box, Link, makeStyles } from "components/Mui";
import { parseTokenAmount, pageArgsFormat, explorerLink, shorten } from "@icpswap/utils";
import dayjs from "dayjs";
import { useToken } from "hooks/index";
import { feeAmountToPercentage } from "utils/swap/index";
import { useFarmInfo, useSwapPoolMetadata, useAllFarms, useFarmState } from "@icpswap/hooks";
import { useFarmTvl, useStateColors } from "hooks/staking-farm";
import { Header, HeaderCell, TableRow, BodyCell, NoData, Pagination, LoadingRow, TextButton, Flex } from "@icpswap/ui";
import upperFirst from "lodash/upperFirst";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "180px repeat(5, 1fr) 140px 60px",
      padding: "16px 0",
      alignItems: "center",
      minWidth: "1136px",
      gap: "0 5px",
    },
  };
});

interface PoolItemProps {
  farmId: string;
}

function PoolItem({ farmId }: PoolItemProps) {
  const { t } = useTranslation();
  const classes = useStyles();

  const { result: farmInfo, loading } = useFarmInfo(farmId);

  const { result: swapPool } = useSwapPoolMetadata(farmInfo?.pool.toString());
  const [, token0] = useToken(swapPool?.token0.address);
  const [, token1] = useToken(swapPool?.token1.address);
  const [, rewardToken] = useToken(farmInfo?.rewardToken.address);

  const { tvl } = useFarmTvl(farmId);
  const state = useFarmState(farmInfo);
  const stateColor = useStateColors(state);

  return loading ? (
    <Box sx={{ padding: "16px" }}>
      <LoadingRow>
        <div />
        <div />
        <div />
        <div />
      </LoadingRow>
    </Box>
  ) : (
    <TableRow className={classes.wrapper}>
      <BodyCell title={farmId}>
        <Link href={explorerLink(farmId)}>{shorten(farmId, 6)}</Link>
      </BodyCell>
      <BodyCell
        sx={{
          overflow: "hidden",
          " a": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
        title={
          token0 && token1 && farmInfo
            ? `${token0.symbol}/${token1.symbol}/${feeAmountToPercentage(Number(farmInfo?.poolFee))}`
            : ""
        }
      >
        {token0 && token1 && farmInfo ? (
          <Link href={explorerLink(farmInfo.pool.toString())}>{`${token0.symbol}/${
            token1.symbol
          }/${feeAmountToPercentage(Number(farmInfo?.poolFee))}`}</Link>
        ) : (
          "--"
        )}
      </BodyCell>
      <BodyCell>{dayjs(Number(farmInfo?.startTime) * 1000).format("YYYY-MM-DD HH:mm")}</BodyCell>
      <BodyCell>{dayjs(Number(farmInfo?.endTime) * 1000).format("YYYY-MM-DD HH:mm")}</BodyCell>
      <Flex vertical gap="4px 0" align="flex-start">
        <BodyCell>{String(farmInfo?.numberOfStakes)}</BodyCell>
        <BodyCell sub>{tvl ? `~$${tvl}` : "--"}</BodyCell>
      </Flex>
      <BodyCell>
        {farmInfo && rewardToken
          ? `${parseTokenAmount(farmInfo.totalReward, rewardToken.decimals).toFormat()} ${rewardToken.symbol}`
          : "--"}
      </BodyCell>
      <BodyCell>
        {state ? (
          <Grid container alignItems="center">
            <Box
              sx={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: stateColor,
                marginRight: "8px",
              }}
            />
            <BodyCell
              sx={{
                color: stateColor,
              }}
            >
              {state === "NOT_STARTED" ? "Unstart" : upperFirst(state.toLocaleLowerCase())}
            </BodyCell>
          </Grid>
        ) : (
          <BodyCell>--</BodyCell>
        )}
      </BodyCell>
      <BodyCell>
        <TextButton to={`/info-farm/details/${farmId}`} sx={{ fontSize: "16px" }}>
          {t("common.details")}
        </TextButton>
      </BodyCell>
    </TableRow>
  );
}

export function FarmPools() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const { result: allFarms, loading } = useAllFarms();

  const handlePageChange = (page: number) => {
    setPagination({ pageNum: page, pageSize: 10 });
  };

  const farms = useMemo(() => {
    if (!allFarms) return undefined;

    const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);
    const length = pagination.pageSize;

    return [...allFarms].slice(offset, offset + length);
  }, [allFarms, pagination]);

  const totalElements = useMemo(() => {
    if (!allFarms) return 0;
    return allFarms.length;
  }, [allFarms]);

  return (
    <Box sx={{ overflow: "auto hidden" }}>
      <Header className={classes.wrapper}>
        <HeaderCell>{t("common.canister.id")}</HeaderCell>
        <HeaderCell>{t("common.pool")}</HeaderCell>
        <HeaderCell>{t("common.start.time")}</HeaderCell>
        <HeaderCell>{t("common.end.time")}</HeaderCell>
        <HeaderCell>{t("common.position.amount")}</HeaderCell>
        <HeaderCell>{t("common.reward.amount")}</HeaderCell>
        <HeaderCell>{t("common.status")}</HeaderCell>
        <HeaderCell>&nbsp;</HeaderCell>
      </Header>

      {farms?.map((farm) => <PoolItem key={farm.toString()} farmId={farm.toString()} />)}

      {farms?.length === 0 && !loading ? <NoData /> : null}

      {loading ? (
        <Box sx={{ padding: "16px" }}>
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
        </Box>
      ) : null}

      {Number(totalElements) > 0 ? (
        <Pagination length={Number(totalElements)} page={pagination.pageNum} onPageChange={handlePageChange} />
      ) : null}
    </Box>
  );
}
