import { Typography, Box, BoxProps, useTheme } from "components/Mui";
import { Flex, Tooltip, APRPanel, BodyCell } from "@icpswap/ui";
import { useCallback, useMemo } from "react";
import { StakingState, type StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useToken } from "hooks/useCurrency";
import { useAccountPrincipal } from "store/auth/hooks";
import {
  formatDollarAmount,
  parseTokenAmount,
  toSignificantWithGroupSeparator,
  formatAmount,
  nonNullArgs,
  BigNumber,
} from "@icpswap/utils";
import { useStakingPoolState, useStakePoolStatInfo } from "@icpswap/hooks";
import { useUSDPrice } from "hooks/useUSDPrice";
import { TokenImage } from "components/Image";
import { useHistory } from "react-router-dom";
import { useApr } from "hooks/staking-token/useApr";
import { useIntervalStakingPoolInfo, useIntervalUserPoolInfo } from "hooks/staking-token/index";
import { useTokenBalance } from "hooks/token";
import dayjs from "dayjs";
import { FilterState } from "types/staking-token";

import { useTranslation } from "react-i18next";
import { State } from "./State";

const DAYJS_FORMAT0 = "MMMM D, YYYY";
const DAYJS_FORMAT1 = "h:mm A";

interface FarmListCardProps {
  wrapperSx?: BoxProps["sx"];
  showState: boolean;
  poolInfo: StakingPoolControllerPoolInfo;
  filterState: FilterState;
  your?: boolean;
}

export function PoolListCard({ poolInfo, wrapperSx, filterState, your, showState }: FarmListCardProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const theme = useTheme();
  const history = useHistory();

  const [, stakeToken] = useToken(poolInfo.stakingToken.address);
  const [, rewardToken] = useToken(poolInfo.rewardToken.address);
  const stakeTokenPrice = useUSDPrice(stakeToken);
  const rewardTokenPrice = useUSDPrice(rewardToken);
  const { result: stakeStatInfo } = useStakePoolStatInfo(poolInfo.canisterId.toString());

  const [stakingPoolInfo] = useIntervalStakingPoolInfo(poolInfo.canisterId.toString());
  const userPoolInfo = useIntervalUserPoolInfo(poolInfo.canisterId.toString(), principal);

  const state = useStakingPoolState(poolInfo);

  const { result: userStakeTokenBalance } = useTokenBalance(poolInfo.stakingToken.address, principal);

  const poolStakeTvl = useMemo(() => {
    if (!stakeToken || !stakeTokenPrice || !stakingPoolInfo) return undefined;
    return parseTokenAmount(stakingPoolInfo.totalDeposit, stakeToken.decimals).multipliedBy(stakeTokenPrice).toString();
  }, [stakeToken, stakeTokenPrice, stakingPoolInfo]);

  const apr = useApr({
    poolInfo: stakingPoolInfo,
    stakeToken,
    stakeTokenPrice,
    rewardToken,
    rewardTokenPrice,
  });

  const handelToDetails = useCallback(() => {
    history.push(`/stake/details/${poolInfo.canisterId.toString()}`);
  }, [history, poolInfo]);

  const { rewardAmount, rewardsUSDValue } = useMemo(() => {
    if (nonNullArgs(rewardToken) && nonNullArgs(stakeStatInfo)) {
      const amount = parseTokenAmount(stakeStatInfo.rewardTokenAmount, rewardToken.decimals).toString();

      return {
        rewardAmount: amount,
        rewardsUSDValue: !rewardTokenPrice ? null : new BigNumber(amount).multipliedBy(rewardTokenPrice).toString(),
      };
    }

    return {};
  }, [stakeStatInfo, rewardToken, rewardTokenPrice]);

  return (
    <Box
      sx={{
        ...wrapperSx,
        cursor: "pointer",
        "&:hover": {
          "& .row-item": {
            background: theme.palette.background.level1,
          },
        },
        "& .row-item": {
          padding: "20px 0",
          borderTop: `1px solid ${theme.palette.background.level1}`,
          "&:first-of-type": {
            padding: "20px 0 20px 24px",
          },
          "&:last-of-type": {
            padding: "20px 24px 20px 0",
          },
        },
      }}
      onClick={handelToDetails}
    >
      <Flex gap="0 8px" className="row-item">
        <TokenImage logo={stakeToken?.logo} tokenId={stakeToken?.address} size="24px" />
        <BodyCell
          sx={{
            width: "150px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          title={stakeToken?.symbol ?? ""}
        >
          {stakeToken ? `${stakeToken.symbol} ` : "--"}
        </BodyCell>
      </Flex>
      <Flex gap="0 8px" className="row-item">
        <TokenImage logo={rewardToken?.logo} tokenId={rewardToken?.address} size="24px" />
        <BodyCell
          sx={{
            width: "150px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          title={rewardToken?.symbol ?? ""}
        >
          {rewardToken ? `${rewardToken.symbol} ` : "--"}
        </BodyCell>
      </Flex>
      <Flex justify="flex-end" className="row-item">
        {apr ? (
          <APRPanel
            value={apr}
            tooltip={
              rewardToken && rewardAmount
                ? t("farm.apr.descriptions", {
                    reward: `${formatAmount(rewardAmount)} ${rewardToken.symbol}`,
                    rewardUsd: rewardsUSDValue ? formatDollarAmount(rewardsUSDValue) : "--",
                  })
                : null
            }
          />
        ) : (
          "--"
        )}
      </Flex>

      {/* User available to stake */}
      {filterState === FilterState.FINISHED ? null : (
        <Flex vertical gap="5px 0" className="row-item" justify="center">
          {state === StakingState.FINISHED ? (
            <Flex fullWidth justify="flex-end">
              <BodyCell>--</BodyCell>
            </Flex>
          ) : (
            <>
              <Flex gap="0 4px" justify="flex-end" fullWidth>
                <BodyCell
                  sx={{
                    maxWidth: "230px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                  title={
                    userStakeTokenBalance && stakeToken
                      ? `${toSignificantWithGroupSeparator(
                          parseTokenAmount(userStakeTokenBalance, stakeToken.decimals).toString(),
                        )} ${stakeToken.symbol}`
                      : ""
                  }
                >
                  {userStakeTokenBalance && stakeToken
                    ? `${toSignificantWithGroupSeparator(
                        parseTokenAmount(userStakeTokenBalance, stakeToken.decimals).toString(),
                      )} ${stakeToken.symbol}`
                    : "--"}
                </BodyCell>

                {state === StakingState.NOT_STARTED ? (
                  <Tooltip
                    tips={`
                  As soon as the Staking Pool goes live on ${dayjs(Number(poolInfo.startTime) * 1000).format(
                    DAYJS_FORMAT0,
                  )} at ${dayjs(Number(poolInfo.startTime) * 1000).format(DAYJS_FORMAT1)}, you can start staking.`}
                    iconSize="14px"
                  />
                ) : null}
              </Flex>
              <Flex gap="0 4px" justify="flex-end" fullWidth>
                <Typography sx={{ fontSize: "12px" }}>
                  {userStakeTokenBalance && stakeToken && stakeTokenPrice
                    ? `${formatDollarAmount(
                        parseTokenAmount(userStakeTokenBalance, stakeToken.decimals)
                          .multipliedBy(stakeTokenPrice)
                          .toString(),
                      )}`
                    : "--"}
                </Typography>
              </Flex>
            </>
          )}
        </Flex>
      )}

      {/* Total Staked */}
      {filterState !== FilterState.FINISHED && !your ? (
        <Flex justify="flex-end" className="row-item">
          <BodyCell>{poolStakeTvl ? formatDollarAmount(poolStakeTvl) : "--"}</BodyCell>
        </Flex>
      ) : null}

      {/* Your Staked */}
      {your || filterState === FilterState.FINISHED ? (
        <Flex vertical gap="5px 0" className="row-item" justify="center">
          <Flex gap="0 4px" justify="flex-end" fullWidth>
            <BodyCell
              sx={{
                maxWidth: "170px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
              title={
                userPoolInfo && stakeToken
                  ? `${toSignificantWithGroupSeparator(
                      parseTokenAmount(userPoolInfo.stakeAmount, stakeToken.decimals).toString(),
                    )} ${stakeToken.symbol}`
                  : ""
              }
            >
              {userPoolInfo && stakeToken
                ? `${toSignificantWithGroupSeparator(
                    parseTokenAmount(userPoolInfo.stakeAmount, stakeToken.decimals).toString(),
                  )} ${stakeToken.symbol}`
                : "--"}
            </BodyCell>
          </Flex>
          <Flex gap="0 4px" justify="flex-end" fullWidth>
            <Typography sx={{ fontSize: "12px" }}>
              {userPoolInfo && stakeToken && stakeTokenPrice
                ? `${formatDollarAmount(
                    parseTokenAmount(userPoolInfo.stakeAmount, stakeToken.decimals)
                      .multipliedBy(stakeTokenPrice)
                      .toString(),
                  )}`
                : "--"}
            </Typography>
          </Flex>
        </Flex>
      ) : null}

      {/* Total reward tokens */}
      {filterState === FilterState.FINISHED ? (
        <Flex vertical gap="5px 0" className="row-item" justify="center" align="flex-end">
          <Flex fullWidth justify="flex-end">
            <BodyCell>
              {rewardAmount && rewardToken ? `${formatAmount(rewardAmount)} ${rewardToken.symbol}` : "--"}
            </BodyCell>
          </Flex>

          <Flex gap="0 4px" justify="flex-end" fullWidth>
            <Typography sx={{ fontSize: "12px" }}>
              {rewardsUSDValue ? `${formatDollarAmount(rewardsUSDValue)}` : "--"}
            </Typography>
          </Flex>
        </Flex>
      ) : null}

      {/* Your rewards */}
      {your ? (
        <Flex vertical gap="5px 0" className="row-item" justify="center">
          <Flex justify="flex-end" fullWidth>
            <BodyCell
              sx={{
                maxWidth: "170px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
              title={
                userPoolInfo && rewardToken
                  ? `${toSignificantWithGroupSeparator(
                      parseTokenAmount(userPoolInfo.pendingReward, rewardToken.decimals).toString(),
                    )} ${rewardToken.symbol}`
                  : ""
              }
            >
              {userPoolInfo && rewardToken
                ? `${toSignificantWithGroupSeparator(
                    parseTokenAmount(userPoolInfo.pendingReward, rewardToken.decimals).toString(),
                  )} ${rewardToken.symbol}`
                : "--"}
            </BodyCell>
          </Flex>
          <Flex gap="0 4px" justify="flex-end" fullWidth>
            <Typography sx={{ fontSize: "12px" }}>
              {userPoolInfo && rewardToken && rewardTokenPrice
                ? `${formatDollarAmount(
                    parseTokenAmount(userPoolInfo.pendingReward, rewardToken.decimals)
                      .multipliedBy(rewardTokenPrice)
                      .toString(),
                  )}`
                : "--"}
            </Typography>
          </Flex>
        </Flex>
      ) : null}
      {showState ? (
        <Flex justify="flex-end" className="row-item">
          <State poolInfo={poolInfo} noState={<Typography sx={{ color: "text.primary" }}>--</Typography>} />
        </Flex>
      ) : null}
    </Box>
  );
}
