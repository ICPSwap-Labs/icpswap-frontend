import { Typography, Box, BoxProps, useTheme } from "components/Mui";
import { Flex, Tooltip, APRPanel } from "@icpswap/ui";
import { useCallback, useMemo } from "react";
import { Trans } from "@lingui/macro";
import { StakingState, type StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useStateColors } from "hooks/staking-token";
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
import upperFirst from "lodash/upperFirst";
import { useHistory } from "react-router-dom";
import { useApr } from "hooks/staking-token/useApr";
import { useIntervalStakingPoolInfo } from "hooks/staking-token/index";
import { useTokenBalance } from "hooks/token";
import dayjs from "dayjs";
import { FilterState } from "types/staking-token";

const DAYJS_FORMAT0 = "MMMM D, YYYY";
const DAYJS_FORMAT1 = "h:mm A";

interface FarmListCardProps {
  wrapperSx?: BoxProps["sx"];
  showState: boolean;
  poolInfo: StakingPoolControllerPoolInfo;
  filterState: FilterState;
}

export function PoolListCard({ poolInfo, wrapperSx, filterState, showState }: FarmListCardProps) {
  const principal = useAccountPrincipal();
  const theme = useTheme();
  const history = useHistory();

  const [, stakeToken] = useToken(poolInfo.stakingToken.address);
  const [, rewardToken] = useToken(poolInfo.rewardToken.address);
  const stakeTokenPrice = useUSDPrice(stakeToken);
  const rewardTokenPrice = useUSDPrice(rewardToken);
  const { result: stakeStatInfo } = useStakePoolStatInfo(poolInfo.canisterId.toString());

  const [stakingPoolInfo] = useIntervalStakingPoolInfo(poolInfo.canisterId.toString());

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

  const stateColor = useStateColors(state);

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

        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            width: "150px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          title={stakeToken?.symbol ?? ""}
        >
          {stakeToken ? `${stakeToken.symbol} ` : "--"}
        </Typography>
      </Flex>

      <Flex gap="0 8px" className="row-item">
        <TokenImage logo={rewardToken?.logo} tokenId={rewardToken?.address} size="24px" />
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            width: "150px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          title={rewardToken?.symbol ?? ""}
        >
          {rewardToken ? `${rewardToken.symbol} ` : "--"}
        </Typography>
      </Flex>

      <Flex justify="flex-end" className="row-item">
        {apr ? (
          <APRPanel
            value={apr}
            tooltip={
              rewardToken && rewardAmount ? (
                <Trans>
                  This's the average APR for the pool. The total reward is {formatAmount(rewardAmount)}{" "}
                  {rewardToken.symbol} ({rewardsUSDValue ? formatDollarAmount(rewardsUSDValue) : "--"}
                  ).
                </Trans>
              ) : null
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
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                --
              </Typography>
            </Flex>
          ) : (
            <>
              <Flex gap="0 4px" justify="flex-end" fullWidth>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.primary",
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
                </Typography>

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

      {filterState !== FilterState.FINISHED ? (
        <Flex justify="flex-end" className="row-item">
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {poolStakeTvl ? formatDollarAmount(poolStakeTvl) : "--"}
          </Typography>
        </Flex>
      ) : null}

      {filterState === FilterState.FINISHED ? (
        <Flex vertical gap="5px 0" className="row-item" justify="center" align="flex-end">
          <Flex fullWidth justify="flex-end">
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {rewardAmount && rewardToken ? `${formatAmount(rewardAmount)} ${rewardToken.symbol}` : "--"}
            </Typography>
          </Flex>

          <Flex gap="0 4px" justify="flex-end" fullWidth>
            <Typography sx={{ fontSize: "12px" }}>
              {rewardsUSDValue ? `${formatDollarAmount(rewardsUSDValue)}` : "--"}
            </Typography>
          </Flex>
        </Flex>
      ) : null}

      {showState ? (
        <Flex justify="flex-end" className="row-item">
          {state ? (
            <Flex gap="0 8px">
              <Box sx={{ width: "8px", height: "8px", borderRadius: "50%", background: stateColor }} />
              <Typography variant="body2" sx={{ color: stateColor }}>
                {state === "NOT_STARTED" ? "Unstart" : upperFirst(state.toLocaleLowerCase())}
              </Typography>
            </Flex>
          ) : (
            "--"
          )}
        </Flex>
      ) : null}
    </Box>
  );
}
