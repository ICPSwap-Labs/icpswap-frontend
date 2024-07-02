import { Box, Typography } from "components/Mui";
import { MainCard, Flex, Tooltip } from "components/index";
import { useTheme } from "@mui/styles";
import { useAccountPrincipal } from "store/auth/hooks";
import { t, Trans } from "@lingui/macro";
import { parseTokenAmount, formatDollarAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Theme } from "@mui/material/styles";
import { useUSDPrice } from "hooks/useUSDPrice";
import { StakingPoolInfo } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";
import { useTokenBalance } from "hooks/token";
import { useApr } from "hooks/staking-token/useApr";
import { useIntervalUserPoolInfo } from "hooks/staking-token";
import { Stake } from "components/stake/Stake";
import { Harvest } from "components/stake/Harvest";
import { Unstake } from "components/stake/Unstake";

export interface StakeMainProps {
  poolId: string | undefined;
  poolInfo: StakingPoolInfo | undefined;
  stakeToken: Token | undefined;
  rewardToken: Token | undefined;
  refreshTrigger: number;
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
  const theme = useTheme() as Theme;
  const principal = useAccountPrincipal();

  const { result: userStakeTokenBalance } = useTokenBalance(stakeToken?.address, principal?.toString(), refreshTrigger);
  const { result: poolStakeTokenBalance } = useTokenBalance(stakeToken?.address, poolId, refreshTrigger);

  const userPoolInfo = useIntervalUserPoolInfo(poolId, principal, refreshTrigger);

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
            <Flex gap="0 4px" align="center">
              <Typography>
                <Trans>APR</Trans>
              </Typography>
              <Tooltip
                iconSize="14px"
                tips={t`The current APR is calculated as an average based on the latest distribution rewards data. The actual returns from staked positions depend on the concentration of the selected price range, the staking duration, and the number of tokens staked.`}
              />
            </Flex>
            <Typography sx={{ color: "text.theme-secondary", fontSize: "24px", fontWeight: 600, margin: "16px 0 0 0" }}>
              {apr ?? "--"}
            </Typography>
          </Box>

          <Box mt="32px">
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
              <Box>
                <Typography>
                  <Trans>Your Available to Stake</Trans>
                </Typography>

                <Typography sx={{ fontSize: "20px", fontWeight: 600, margin: "12px 0 0 0", color: "text.primary" }}>
                  {stakeToken && userStakeTokenBalance ? (
                    <>
                      {toSignificantWithGroupSeparator(
                        parseTokenAmount(userStakeTokenBalance, stakeToken.decimals).toString(),
                      )}
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

              <Box>
                <Typography>
                  <Trans>Total Staked</Trans>
                </Typography>
                <Typography sx={{ fontSize: "20px", fontWeight: 600, margin: "12px 0 0 0", color: "text.primary" }}>
                  {poolInfo && stakeToken && poolStakeTokenBalance ? (
                    <>
                      {parseTokenAmount(poolStakeTokenBalance, stakeToken.decimals).toFormat()}&nbsp;
                      {stakeToken.symbol}
                    </>
                  ) : (
                    "--"
                  )}
                </Typography>

                <Typography sx={{ margin: "8px 0 0 0" }}>
                  {poolInfo && stakeToken && stakeTokenPrice && poolStakeTokenBalance
                    ? `~${formatDollarAmount(
                        parseTokenAmount(poolStakeTokenBalance, stakeToken.decimals)
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
                  <Typography>
                    <Trans>Reward Token</Trans>
                  </Typography>

                  <Tooltip
                    tips={t`You will receive the reward tokens you have earned after unstaking the staked positions.`}
                  />
                </Flex>

                <Typography sx={{ fontSize: "20px", fontWeight: 600, margin: "12px 0 0 0", color: "text.primary" }}>
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

      <MainCard padding="0" level={2} sx={{ margin: "8px 0 0 0", "@media(max-width: 640px)": { padding: "0" } }}>
        <Stake
          poolId={poolId}
          poolInfo={poolInfo}
          rewardToken={rewardToken}
          stakeToken={stakeToken}
          balance={userStakeTokenBalance}
          onStakeSuccess={handleRefresh}
        />

        <Box sx={{ padding: "16px" }}>
          <Flex justify="space-between">
            <Box>
              <Typography>
                <Trans>Your Staked</Trans>
              </Typography>

              <Typography sx={{ fontWeight: 500, fontSize: "20px", margin: "12px 0 0 0", color: "text.primary" }}>
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
            </Box>

            <Unstake
              poolId={poolId}
              rewardToken={rewardToken}
              stakeToken={stakeToken}
              onUnStakeSuccess={handleRefresh}
              stakeAmount={userPoolInfo?.stakeAmount}
              stakeTokenPrice={stakeTokenPrice}
            />
          </Flex>
        </Box>
      </MainCard>
    </>
  );
}
