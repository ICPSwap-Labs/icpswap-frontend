import { Box, Typography, useTheme } from "components/Mui";
import { MainCard, Flex, Tooltip } from "components/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { parseTokenAmount, formatDollarAmount, toSignificantWithGroupSeparator, formatAmount } from "@icpswap/utils";
import { useUSDPrice } from "hooks/useUSDPrice";
import { Null, StakingPoolInfo } from "@icpswap/types";
import { useStakePoolStatInfo } from "@icpswap/hooks";
import { Token } from "@icpswap/swap-sdk";
import { useTokenBalance } from "hooks/token";
import { useApr } from "hooks/staking-token/useApr";
import { useIntervalUserPoolInfo } from "hooks/staking-token";
import { Stake } from "components/stake/Stake";
import { Harvest, Unstake } from "components/stake/index";
import { useTranslation } from "react-i18next";

export interface StakeMainProps {
  poolId: string | undefined;
  poolInfo: StakingPoolInfo | undefined;
  stakeToken: Token | undefined;
  rewardToken: Token | undefined;
  refreshTrigger: number | Null;
  handleRefresh: () => void;
}

export function MainContent({
  refreshTrigger,
  poolId,
  poolInfo,
  stakeToken,
  rewardToken,
  handleRefresh,
}: StakeMainProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const principal = useAccountPrincipal();

  const { result: userStakeTokenBalance } = useTokenBalance(stakeToken?.address, principal?.toString(), refreshTrigger);

  const userPoolInfo = useIntervalUserPoolInfo(poolId, principal, refreshTrigger);
  const { result: stakeStatInfo } = useStakePoolStatInfo(poolId);

  const rewardTokenPrice = useUSDPrice(rewardToken);
  const stakeTokenPrice = useUSDPrice(stakeToken);

  const apr = useApr({
    stakeToken,
    stakeTokenPrice,
    rewardToken,
    rewardTokenPrice,
    poolInfo,
  });

  return (
    <>
      <Box mt="16px">
        <MainCard
          padding="24px 0"
          level={2}
          border="level4"
          sx={{
            "@media(max-width: 640px)": {
              padding: "24px 0",
            },
          }}
        >
          <Box sx={{ padding: "0 16px" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                "@media(max-width: 640px)": {
                  gridTemplateColumns: "1fr",
                  gap: "24px 0",
                },
              }}
            >
              <Box>
                <Flex gap="0 4px" align="center">
                  <Typography>{t("common.apr")}</Typography>
                  <Tooltip
                    iconSize="14px"
                    tips={t`The APR (Annual Percentage Rate) in a staking pool is calculated based on the number of reward tokens earned per second for each staked token. The potential annual return (APR) depends on the value of the staked tokens and the value of the reward tokens.`}
                  />
                </Flex>
                <Typography sx={{ color: "text.apr", fontSize: "20px", fontWeight: 600, margin: "16px 0 0 0" }}>
                  {apr ?? "--"}
                </Typography>
              </Box>

              <Box>
                <Flex gap="0 4px" align="center">
                  <Typography>{t("common.pool.rewards")}</Typography>
                </Flex>
                <Typography sx={{ fontSize: "20px", color: "text.primary", fontWeight: 600, margin: "16px 0 0 0" }}>
                  {stakeStatInfo && rewardToken
                    ? `${formatAmount(
                        parseTokenAmount(stakeStatInfo.rewardTokenAmount, rewardToken.decimals).toString(),
                      )} ${rewardToken.symbol}`
                    : "--"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box mt="24px">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                padding: "0 16px",
                "@media(max-width: 640px)": {
                  gridTemplateColumns: "1fr",
                  gap: "24px 0",
                },
              }}
            >
              <Box sx={{ maxWidth: "270px", "@media(max-width: 640px)": { maxWidth: "360px" } }}>
                <Typography>{t("common.your.available.stake")}</Typography>

                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: 600,
                    margin: "12px 0 0 0",
                    color: "text.primary",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  title={
                    stakeToken && userStakeTokenBalance
                      ? `${formatAmount(parseTokenAmount(userStakeTokenBalance, stakeToken.decimals).toString())} ${
                          stakeToken.symbol
                        }`
                      : ""
                  }
                >
                  {stakeToken && userStakeTokenBalance ? (
                    <>
                      {formatAmount(parseTokenAmount(userStakeTokenBalance, stakeToken.decimals).toString())}
                      &nbsp;
                      {stakeToken.symbol}
                    </>
                  ) : (
                    "--"
                  )}
                </Typography>

                <Typography sx={{ margin: "8px 0 0 0" }}>
                  {stakeToken && stakeTokenPrice && userStakeTokenBalance
                    ? `~${formatDollarAmount(
                        parseTokenAmount(userStakeTokenBalance, stakeToken.decimals)
                          .multipliedBy(stakeTokenPrice)
                          .toString(),
                      )}`
                    : "--"}
                </Typography>
              </Box>

              <Box sx={{ maxWidth: "194px", "@media(max-width: 640px)": { maxWidth: "360px" } }}>
                <Typography>{t("stake.total.staked")}</Typography>
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: 600,
                    margin: "12px 0 0 0",
                    color: "text.primary",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  title={
                    poolInfo && stakeToken
                      ? `${formatAmount(parseTokenAmount(poolInfo.totalDeposit, stakeToken.decimals).toString())} ${
                          stakeToken.symbol
                        }`
                      : ""
                  }
                >
                  {poolInfo && stakeToken ? (
                    <>
                      {formatAmount(parseTokenAmount(poolInfo.totalDeposit, stakeToken.decimals).toString())}
                      &nbsp;
                      {stakeToken.symbol}
                    </>
                  ) : (
                    "--"
                  )}
                </Typography>

                <Typography sx={{ margin: "8px 0 0 0" }}>
                  {poolInfo && stakeToken && stakeTokenPrice
                    ? `~${formatDollarAmount(
                        parseTokenAmount(poolInfo.totalDeposit, stakeToken.decimals)
                          .multipliedBy(stakeTokenPrice)
                          .toString(),
                      )}`
                    : "--"}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                width: "100%",
                margin: "24px 0",
                height: "1px",
                background: theme.palette.background.level4,
              }}
            />

            <Flex justify="space-between" sx={{ padding: "0 16px" }}>
              <Box>
                <Flex gap="0 4px">
                  <Typography>{t("common.your.rewards")}</Typography>
                </Flex>

                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: 600,
                    margin: "12px 0 0 0",
                    color: "text.primary",
                    maxWidth: "190px",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  title={
                    userPoolInfo && rewardToken
                      ? `${toSignificantWithGroupSeparator(
                          parseTokenAmount(userPoolInfo.pendingReward, rewardToken.decimals).toString(),
                          4,
                        )} ${rewardToken.symbol}`
                      : ""
                  }
                >
                  {userPoolInfo && rewardToken ? (
                    <>
                      {toSignificantWithGroupSeparator(
                        parseTokenAmount(userPoolInfo.pendingReward, rewardToken.decimals).toString(),
                        4,
                      )}
                      &nbsp;
                      {rewardToken.symbol}
                    </>
                  ) : (
                    "--"
                  )}
                </Typography>

                <Typography sx={{ margin: "8px 0 0 0" }}>
                  {userPoolInfo && rewardTokenPrice && rewardToken
                    ? `~${formatDollarAmount(
                        parseTokenAmount(userPoolInfo.pendingReward, rewardToken.decimals)
                          .multipliedBy(rewardTokenPrice)
                          .toString(),
                      )}`
                    : "--"}
                </Typography>
              </Box>

              <Harvest
                rewardToken={rewardToken}
                rewardAmount={userPoolInfo?.pendingReward}
                poolId={poolId}
                onHarvestSuccess={handleRefresh}
              />
            </Flex>
          </Box>
        </MainCard>
      </Box>

      <MainCard padding="0" level={1} sx={{ margin: "8px 0 0 0", "@media(max-width: 640px)": { padding: "0" } }}>
        <Stake
          poolId={poolId}
          poolInfo={poolInfo}
          rewardToken={rewardToken}
          stakeToken={stakeToken}
          balance={userStakeTokenBalance}
          onStakeSuccess={handleRefresh}
        />

        <MainCard level={2} padding="16px" borderRadius="0px 0px 16px 16px" sx={{ margin: "2px 0 0 0" }}>
          <Flex justify="space-between">
            <Box>
              <Typography>{t("stake.your.staked")}</Typography>

              <Typography component="div" sx={{ "@media(max-width: 640px)": { maxWidth: "220px" } }}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "20px",
                    margin: "12px 0 0 0",
                    color: "text.primary",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  title={
                    stakeToken && userPoolInfo
                      ? `${toSignificantWithGroupSeparator(
                          parseTokenAmount(userPoolInfo.stakeAmount, stakeToken.decimals).toString(),
                        )} ${stakeToken.symbol}`
                      : ""
                  }
                >
                  {stakeToken && userPoolInfo
                    ? `${toSignificantWithGroupSeparator(
                        parseTokenAmount(userPoolInfo.stakeAmount, stakeToken.decimals).toString(),
                      )} ${stakeToken.symbol}`
                    : "--"}
                </Typography>
                <Typography sx={{ margin: "8px 0 0 0" }}>
                  {stakeToken && userPoolInfo && stakeTokenPrice
                    ? `~${formatDollarAmount(
                        parseTokenAmount(userPoolInfo.stakeAmount, stakeToken.decimals)
                          .multipliedBy(stakeTokenPrice)
                          .toString(),
                      )}`
                    : "--"}
                </Typography>
              </Typography>
            </Box>

            <Unstake
              poolId={poolId}
              rewardToken={rewardToken}
              stakeToken={stakeToken}
              onUnStakeSuccess={handleRefresh}
              stakeAmount={userPoolInfo?.stakeAmount}
              rewardAmount={userPoolInfo?.pendingReward}
              stakeTokenPrice={stakeTokenPrice}
              rewardTokenPrice={rewardTokenPrice}
            />
          </Flex>
        </MainCard>
      </MainCard>
    </>
  );
}
