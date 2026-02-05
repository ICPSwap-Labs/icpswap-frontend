import { Typography, Box, BoxProps, useTheme } from "components/Mui";
import { Flex, APRPanel } from "@icpswap/ui";
import { useCallback } from "react";
import { type StakingPoolControllerPoolInfo, StakingState } from "@icpswap/types";
import { useStateColors } from "hooks/staking-token";
import { useToken } from "hooks/useCurrency";
import { useAccountPrincipal } from "store/auth/hooks";
import { formatDollarAmount, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { useStakingPoolState } from "@icpswap/hooks";
import { useUSDPrice } from "hooks/useUSDPrice";
import { TokenImage } from "components/Image";
import upperFirst from "lodash/upperFirst";
import { useNavigate } from "react-router-dom";
import { useApr } from "hooks/staking-token/useApr";
import { useIntervalStakingPoolInfo, useIntervalUserPoolInfo } from "hooks/staking-token/index";
import { useTokenBalance } from "hooks/token";
import { useTranslation } from "react-i18next";

interface FarmListCardProps {
  wrapperSx?: BoxProps["sx"];
  showState: boolean;
  poolInfo: StakingPoolControllerPoolInfo;
}

export function YourPoolListCard({ poolInfo, wrapperSx, showState }: FarmListCardProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const theme = useTheme();
  const navigate = useNavigate();

  const [, stakeToken] = useToken(poolInfo.stakingToken.address);
  const [, rewardToken] = useToken(poolInfo.rewardToken.address);
  const stakeTokenPrice = useUSDPrice(stakeToken);
  const rewardTokenPrice = useUSDPrice(rewardToken);

  const [stakingPoolInfo] = useIntervalStakingPoolInfo(poolInfo.canisterId.toString());
  const userPoolInfo = useIntervalUserPoolInfo(poolInfo.canisterId.toString(), principal);

  const state = useStakingPoolState(poolInfo);

  const { result: userTokenBalance } = useTokenBalance(poolInfo.stakingToken.address, principal);

  const apr = useApr({
    poolInfo: stakingPoolInfo,
    stakeToken,
    stakeTokenPrice,
    rewardToken,
    rewardTokenPrice,
  });

  const stateColor = useStateColors(state);

  const handelToDetails = useCallback(() => {
    navigate(`/stake/details/${poolInfo.canisterId.toString()}`);
  }, [navigate, poolInfo]);

  return (
    <Box
      sx={{
        ...wrapperSx,
        cursor: "pointer",
        height: "64px",
        "&:hover": {
          "& .row-item": {
            background: theme.palette.background.level1,
          },
        },
        "& .row-item": {
          height: "64px",
          borderTop: `1px solid ${theme.palette.background.level1}`,
          "&:first-of-type": {
            padding: "0 0 0 24px",
          },
          "&:last-of-type": {
            padding: "0 24px 0 0",
          },
        },
      }}
      onClick={handelToDetails}
    >
      <Flex gap="0 8px" className="row-item">
        <TokenImage logo={stakeToken?.logo} tokenId={stakeToken?.address} size="24px" />

        <Typography
          sx={{
            color: "text.primary",
            maxWidth: "150px",
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
          sx={{
            color: "text.primary",
            maxWidth: "150px",
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
            tooltip={t("farm.apr.descriptions", {
              reward: "100,000 ICS",
              rewardUsd: "$3,000",
            })}
          />
        ) : (
          <Typography sx={{ color: "text.apr" }}>--</Typography>
        )}
      </Flex>

      <Flex vertical gap="5px 0" className="row-item" justify="center">
        {state === StakingState.FINISHED ? (
          <Flex fullWidth justify="flex-end">
            <Typography sx={{ color: "text.primary" }}>--</Typography>
          </Flex>
        ) : (
          <>
            <Flex gap="0 4px" justify="flex-end" fullWidth>
              <Typography
                sx={{
                  color: "text.primary",
                  maxWidth: "230px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
                title={
                  userTokenBalance && stakeToken
                    ? `${toSignificantWithGroupSeparator(
                        parseTokenAmount(userTokenBalance, stakeToken.decimals).toString(),
                      )} ${stakeToken.symbol}`
                    : ""
                }
              >
                {userTokenBalance && stakeToken
                  ? `${toSignificantWithGroupSeparator(
                      parseTokenAmount(userTokenBalance, stakeToken.decimals).toString(),
                    )} ${stakeToken.symbol}`
                  : "--"}
              </Typography>
            </Flex>
            <Flex gap="0 4px" justify="flex-end" fullWidth>
              <Typography sx={{ fontSize: "12px" }}>
                {userTokenBalance && stakeToken && stakeTokenPrice
                  ? `${formatDollarAmount(
                      parseTokenAmount(userTokenBalance, stakeToken.decimals).multipliedBy(stakeTokenPrice).toString(),
                    )}`
                  : "--"}
              </Typography>
            </Flex>
          </>
        )}
      </Flex>

      <Flex vertical gap="5px 0" className="row-item" justify="center">
        <Flex gap="0 4px" justify="flex-end" fullWidth>
          <Typography
            sx={{
              color: "text.primary",
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
          </Typography>
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

      <Flex vertical gap="5px 0" className="row-item" justify="center">
        <Flex justify="flex-end" fullWidth>
          <Typography
            sx={{
              color: "text.primary",
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
          </Typography>
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

      {showState ? (
        <Flex justify="flex-end" className="row-item">
          {state ? (
            <Flex gap="0 8px">
              <Box sx={{ width: "8px", height: "8px", borderRadius: "50%", background: stateColor }} />
              <Typography sx={{ color: stateColor }}>
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
