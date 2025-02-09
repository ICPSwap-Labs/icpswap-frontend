import React from "react";
import { Box, Collapse, Typography, useTheme } from "components/Mui";
import { MainCard, Flex, Link, Image } from "components/index";
import { INFO_URL } from "constants/index";
import {
  parseTokenAmount,
  toSignificantWithGroupSeparator,
  cycleValueFormat,
  shorten,
  timestampFormat,
  explorerLink,
  formatDollarAmount,
} from "@icpswap/utils";
import { useFarmInitArgs, useFarmCycles, useFarmState } from "@icpswap/hooks";
import Countdown from "react-countdown";
import { STATE } from "types/staking-farm";
import { Token } from "@icpswap/swap-sdk";
import { ArrowUpRight } from "react-feather";
import { FarmInfo, FarmRewardMetadata } from "@icpswap/types";
import { useTranslation } from "react-i18next";

const CountdownBox = ({ startTime, endTime }: { startTime: number; endTime: number }) => {
  const { t } = useTranslation();

  const nowTime = parseInt(String(Date.now() / 1000));
  let expand = false;
  let date = startTime;
  if (nowTime > endTime) {
    expand = true;
  }
  if (nowTime < startTime) {
    date = startTime * 1000;
  } else if (nowTime > startTime && nowTime < endTime) {
    date = endTime * 1000;
  } else {
    date = 0;
  }

  return expand ? <Typography color="text.primary">{t("common.end")}</Typography> : <Countdown date={date} />;
};

export interface FarmDetailsProps {
  farmId: string;
  farmInfo: FarmInfo | undefined;
  token0: Token | undefined;
  token1: Token | undefined;
  rewardToken: Token | undefined;
  rewardTokenPrice: number | string | undefined;
  rewardMetadata: FarmRewardMetadata | undefined;
}

export function FarmDetails({
  farmId,
  token0,
  token1,
  rewardToken,
  rewardTokenPrice,
  rewardMetadata,
  farmInfo,
}: FarmDetailsProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [expanded, setExpanded] = React.useState(false);

  const { result: farmInitArgs } = useFarmInitArgs(farmId);

  const state = useFarmState(farmInfo);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { result: cycles } = useFarmCycles(farmId);

  return (
    <Box mt="8px">
      <MainCard level={1} borderRadius="16px" padding="24px">
        <Flex justify="center">
          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: "24px",
              textAlign: "center",
              color: "#648EFB",
              cursor: "pointer",
            }}
            onClick={handleExpandClick}
          >
            {expanded ? t`Hide` : t`Details`}
          </Typography>
        </Flex>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ width: "100%", height: "12px" }} />

          <Flex vertical gap="16px 0" align="flex-start">
            <Flex gap="0 4px">
              {token0 && token1 ? (
                <>
                  <Link
                    to={`/liquidity/add/${token0.address}/${token1.address}?path=${window.btoa(
                      `/farm/details/${farmId}`,
                    )}`}
                  >
                    <Typography color="text.secondary">{t("farm.get.position")}</Typography>
                  </Link>

                  <Image src="/images/external-link.svg" sx={{ width: "24px", height: "24px", cursor: "pointer" }} />
                </>
              ) : null}
            </Flex>

            <Flex fullWidth justify="space-between">
              <Typography>{t("farm.total.staked.positions")}</Typography>
              <Typography color="text.primary">{farmInfo ? farmInfo.numberOfStakes.toString() : "--"}</Typography>
            </Flex>

            <Flex fullWidth justify="space-between" align="flex-start">
              <Typography>{t("farm.claimed.rewards")}</Typography>
              <Flex vertical align="flex-end">
                <Typography color="text.primary">
                  {!rewardMetadata || !rewardToken
                    ? "--"
                    : `${toSignificantWithGroupSeparator(
                        parseTokenAmount(
                          rewardMetadata.totalRewardHarvested.toString(),
                          rewardToken.decimals,
                        ).toString(),
                        8,
                      )} ${rewardToken.symbol}`}
                </Typography>

                <Typography mt="4px">
                  {!rewardMetadata || !rewardToken || !rewardTokenPrice
                    ? "--"
                    : `${formatDollarAmount(
                        parseTokenAmount(rewardMetadata.totalRewardHarvested.toString(), rewardToken.decimals)
                          .multipliedBy(rewardTokenPrice)
                          .toString(),
                      )}`}
                </Typography>
              </Flex>
            </Flex>

            <Flex fullWidth justify="space-between" align="flex-start">
              <Typography>{t("farm.unclaimed.rewards")}</Typography>

              <Flex vertical align="flex-end">
                <Typography color="text.primary">
                  {!rewardMetadata || !rewardToken
                    ? "--"
                    : `${toSignificantWithGroupSeparator(
                        parseTokenAmount(
                          rewardMetadata.totalRewardUnharvested.toString(),
                          rewardToken.decimals,
                        ).toString(),
                        8,
                      )} ${rewardToken.symbol}`}
                </Typography>

                <Typography mt="4px">
                  {!rewardMetadata || !rewardToken || !rewardTokenPrice
                    ? "--"
                    : `${formatDollarAmount(
                        parseTokenAmount(rewardMetadata.totalRewardUnharvested.toString(), rewardToken.decimals)
                          .multipliedBy(rewardTokenPrice)
                          .toString(),
                      )}`}
                </Typography>
              </Flex>
            </Flex>

            <Flex fullWidth justify="space-between">
              <Typography>{t("farm.min.stake.number")}</Typography>
              <Typography color="text.primary" component="div">
                {farmInitArgs && token0 && token1
                  ? `${toSignificantWithGroupSeparator(
                      parseTokenAmount(farmInitArgs.token0AmountLimit.toString(), token0.decimals).toString(),
                    )} ${token0.symbol} / ${toSignificantWithGroupSeparator(
                      parseTokenAmount(farmInitArgs.token1AmountLimit.toString(), token1.decimals).toString(),
                    )} ${token1.symbol}`
                  : "--"}
              </Typography>
            </Flex>

            <Flex fullWidth justify="space-between">
              <Typography>{t("farm.trading.pair.id")}</Typography>
              <Typography color="text.primary" component="div">
                {farmInfo ? (
                  <Link link={explorerLink(farmInfo.pool.toString())}>
                    <Typography color="text.theme-secondary">{shorten(farmInfo.pool.toString())}</Typography>
                  </Link>
                ) : (
                  "--"
                )}
              </Typography>
            </Flex>

            <Flex fullWidth justify="space-between">
              <Typography>
                <Typography>{t("farm.reward.id")}</Typography>
              </Typography>
              <Typography color="text.primary" component="div">
                {rewardToken ? (
                  <Link link={explorerLink(rewardToken.address)}>
                    <Typography color="text.theme-secondary">{shorten(rewardToken.address)}</Typography>
                  </Link>
                ) : (
                  "--"
                )}
              </Typography>
            </Flex>

            <Flex fullWidth justify="space-between">
              <Typography>{t("farm.distribution.interval")}</Typography>
              <Typography color="text.primary">
                {Number(rewardMetadata?.secondPerCycle ?? 0) / 60} {t("common.min")}
              </Typography>
            </Flex>

            <Flex fullWidth justify="space-between">
              <Typography>{t("farm.amount.per.distribution")}</Typography>
              <Typography color="text.primary">
                {rewardMetadata && rewardToken
                  ? `${toSignificantWithGroupSeparator(
                      parseTokenAmount(rewardMetadata.rewardPerCycle, rewardToken.decimals).toString(),
                      8,
                    )} ${rewardToken.symbol}`
                  : "--"}
              </Typography>
            </Flex>

            <Flex fullWidth justify="space-between">
              <Typography>{t("common.starting")}</Typography>
              <Typography color="text.primary">{timestampFormat(Number(farmInfo?.startTime) * 1000)}</Typography>
            </Flex>

            <Flex fullWidth justify="space-between">
              <Typography>{state === STATE.NOT_STARTED ? t("common.left") : t("common.end.in")}</Typography>
              <Typography color="text.primary" component="div">
                <CountdownBox startTime={Number(farmInfo?.startTime)} endTime={Number(farmInfo?.endTime)} />
              </Typography>
            </Flex>

            <Flex fullWidth justify="space-between">
              <Typography>{t("common.creator")}</Typography>
              <Typography color="text.primary.main">
                {farmInfo ? (
                  <Link link={explorerLink(farmInfo.creator.toString())}>
                    <Typography color="text.theme-secondary">{shorten(farmInfo.creator.toString())}</Typography>
                  </Link>
                ) : (
                  "--"
                )}
              </Typography>
            </Flex>

            <Flex fullWidth justify="space-between">
              <Typography>{t("common.canister.id")}</Typography>
              <Typography color="text.primary">
                <Link link={explorerLink(farmId)}>
                  <Typography color="text.theme-secondary"> {shorten(farmId)}</Typography>
                </Link>
              </Typography>
            </Flex>

            <Flex fullWidth justify="space-between">
              <Typography>{t("common.cycles.left")}</Typography>
              <Typography color="text.primary">{cycles?.balance ? cycleValueFormat(cycles?.balance) : "--"}</Typography>
            </Flex>

            <Flex justify="flex-end" sx={{ width: "100%" }} align="center">
              <Link link={`${INFO_URL}/info-farm/details/${farmId}`}>
                <Typography color="text.theme-secondary">{t("farm.info")}</Typography>
              </Link>
              <ArrowUpRight size="16px" color={theme.colors.secondaryMain} />
            </Flex>
          </Flex>
        </Collapse>
      </MainCard>
    </Box>
  );
}
