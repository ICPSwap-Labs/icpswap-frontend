import React, { useMemo } from "react";
import { Box, Collapse, Typography, useTheme } from "components/Mui";
import { Link } from "@mui/material";
import { MainCard, Flex, Image } from "components/index";
import { INFO_URL } from "constants/index";
import {
  parseTokenAmount,
  toSignificantWithGroupSeparator,
  cycleValueFormat,
  shorten,
  timestampFormat,
  explorerLink,
  formatDollarAmount,
  nonNullArgs,
} from "@icpswap/utils";
import { useStakingPoolState, useStakingPoolCycles, useStakingPoolUserInfo } from "@icpswap/hooks";
import Countdown from "react-countdown";
import { Token } from "@icpswap/swap-sdk";
import { ArrowUpRight } from "react-feather";
import { StakingPoolInfo, StakingState } from "@icpswap/types";
import { ICP } from "@icpswap/tokens";
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

export interface StakeDetailsProps {
  poolId: string | undefined;
  poolInfo: StakingPoolInfo | undefined;
  stakeToken: Token | undefined;
  rewardToken: Token | undefined;
  rewardTokenPrice: number | string | undefined;
}

export function StakeDetails({ poolId, stakeToken, rewardToken, rewardTokenPrice, poolInfo }: StakeDetailsProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [expanded, setExpanded] = React.useState(false);

  const state = useStakingPoolState(poolInfo);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { result: cycles } = useStakingPoolCycles(poolId);
  const { result: stakingPoolUserInfo } = useStakingPoolUserInfo(poolId, 0, 1);

  const totalStaker = useMemo(() => {
    return stakingPoolUserInfo?.totalElements;
  }, [stakingPoolUserInfo]);

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
            {expanded ? t("common.hide") : t("common.details")}
          </Typography>
        </Flex>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ width: "100%", height: "12px" }} />

          <Flex vertical gap="16px 0" align="flex-start">
            <Flex gap="0 4px">
              {stakeToken ? (
                <>
                  <Link href={`/swap?input=${ICP.address}&output=${stakeToken.address}`} color="text.secondary">
                    Get {stakeToken.symbol}
                  </Link>

                  <Image src="/images/external-link.svg" sx={{ width: "22px", height: "22px", cursor: "pointer" }} />
                </>
              ) : null}
            </Flex>

            <Flex sx={{ width: "100%" }} justify="space-between">
              <Typography>{t("common.total.rewarded")}</Typography>

              <Flex vertical align="flex-end">
                <Typography color="text.primary">
                  {!poolInfo || !rewardToken
                    ? "--"
                    : `${toSignificantWithGroupSeparator(
                        parseTokenAmount(poolInfo.rewardDebt.toString(), rewardToken.decimals).toString(),
                        8,
                      )} ${rewardToken.symbol}`}
                </Typography>
              </Flex>
            </Flex>

            {stakeToken ? (
              <Flex sx={{ width: "100%" }} justify="space-between">
                <Typography>{t("stake.details.token", { symbol: stakeToken.symbol })}</Typography>

                <Link href={explorerLink(stakeToken.address.toString())} target="_blank" color="text.theme-secondary">
                  {shorten(stakeToken.address.toString())}
                </Link>
              </Flex>
            ) : null}

            {rewardToken ? (
              <Flex sx={{ width: "100%" }} justify="space-between">
                <Typography>
                  {t("common.reward.token")}({rewardToken.symbol})
                </Typography>

                <Link href={explorerLink(rewardToken.address.toString())} target="_blank" color="text.theme-secondary">
                  {shorten(rewardToken.address.toString())}
                </Link>
              </Flex>
            ) : null}

            <Flex sx={{ width: "100%" }} justify="space-between" align="flex-start">
              <Typography>{t("stake.reward.per.second")}</Typography>
              <Flex vertical align="flex-end">
                <Typography color="text.primary">
                  {!rewardToken || !poolInfo
                    ? "--"
                    : `${toSignificantWithGroupSeparator(
                        parseTokenAmount(poolInfo.rewardPerTime, rewardToken.decimals).toString(),
                        8,
                      )} ${rewardToken.symbol}`}
                </Typography>

                <Typography mt="4px">
                  {!rewardToken || !rewardTokenPrice || !poolInfo
                    ? "--"
                    : `${formatDollarAmount(
                        parseTokenAmount(poolInfo.rewardPerTime, rewardToken.decimals)
                          .multipliedBy(rewardTokenPrice)
                          .toString(),
                      )}`}
                </Typography>
              </Flex>
            </Flex>

            <Flex sx={{ width: "100%" }} justify="space-between" align="flex-start">
              <Typography>{t("stake.reward.per.day")}</Typography>
              <Flex vertical align="flex-end">
                <Typography color="text.primary">
                  {!rewardToken || !poolInfo
                    ? "--"
                    : `${toSignificantWithGroupSeparator(
                        parseTokenAmount(poolInfo.rewardPerTime, rewardToken.decimals)
                          .multipliedBy(24 * 60 * 60)
                          .toString(),
                        8,
                      )} ${rewardToken.symbol}`}
                </Typography>

                <Typography mt="4px">
                  {!rewardToken || !rewardTokenPrice || !poolInfo
                    ? "--"
                    : `${formatDollarAmount(
                        parseTokenAmount(poolInfo.rewardPerTime, rewardToken.decimals)
                          .multipliedBy(24 * 60 * 60)
                          .multipliedBy(rewardTokenPrice)
                          .toString(),
                      )}`}
                </Typography>
              </Flex>
            </Flex>

            <Flex sx={{ width: "100%" }} justify="space-between">
              <Typography>{t("stake.total.staked")}</Typography>

              <Flex vertical align="flex-end">
                <Typography color="text.primary">
                  {!poolInfo || !stakeToken
                    ? "--"
                    : `${toSignificantWithGroupSeparator(
                        parseTokenAmount(poolInfo.totalDeposit, stakeToken.decimals).toString(),
                        8,
                      )} ${stakeToken.symbol}`}
                </Typography>
              </Flex>
            </Flex>

            <Flex sx={{ width: "100%" }} justify="space-between">
              <Typography>{t("stake.total.staker")}</Typography>
              <Typography color="text.primary" component="div">
                {nonNullArgs(totalStaker) ? `${totalStaker.toString()}` : "--"}
              </Typography>
            </Flex>

            <Flex sx={{ width: "100%" }} justify="space-between">
              <Typography>{t("common.starting")}</Typography>
              <Typography color="text.primary">{timestampFormat(Number(poolInfo?.startTime) * 1000)}</Typography>
            </Flex>

            <Flex sx={{ width: "100%" }} justify="space-between">
              <Typography>{state === StakingState.NOT_STARTED ? t("common.left") : t("common.end.in")}</Typography>
              <Typography color="text.primary" component="div">
                <CountdownBox startTime={Number(poolInfo?.startTime)} endTime={Number(poolInfo?.bonusEndTime)} />
              </Typography>
            </Flex>

            <Flex sx={{ width: "100%" }} justify="space-between">
              <Typography>{t("common.creator")}</Typography>
              <Typography color="text.primary.main">
                {poolInfo ? (
                  <Link href={explorerLink(poolInfo.creator.toString())} target="_blank" color="text.theme-secondary">
                    {shorten(poolInfo.creator.toString())}
                  </Link>
                ) : (
                  "--"
                )}
              </Typography>
            </Flex>

            <Flex sx={{ width: "100%" }} justify="space-between">
              <Typography>{t("common.canister.id")}</Typography>
              <Typography color="text.primary">
                {poolId ? (
                  <Link href={explorerLink(poolId)} target="_blank" color="text.theme-secondary">
                    {shorten(poolId)}
                  </Link>
                ) : (
                  "--"
                )}
              </Typography>
            </Flex>

            <Flex sx={{ width: "100%" }} justify="space-between">
              <Typography>{t("common.cycles.left")}</Typography>
              <Typography color="text.primary">{cycles?.balance ? cycleValueFormat(cycles?.balance) : "--"}</Typography>
            </Flex>

            {poolInfo && poolId ? (
              <Flex justify="flex-end" sx={{ width: "100%" }} align="center">
                <Link href={`${INFO_URL}/info-stake/details/${poolId}`} target="_blank" color="text.theme-secondary">
                  {t("stake.link.text")}
                </Link>
                <ArrowUpRight size="16px" color={theme.colors.secondaryMain} />
              </Flex>
            ) : null}
          </Flex>
        </Collapse>
      </MainCard>
    </Box>
  );
}
