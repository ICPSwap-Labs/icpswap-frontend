import { Typography, Box } from "components/Mui";
import { Flex, LoadingRow, MainCard, NoData } from "@icpswap/ui";
import { Trans } from "@lingui/macro";
import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { StakingTokenImages } from "components/stake/StakingTokenImage";
import { useToken } from "hooks/useCurrency";
import { useStakingPools } from "@icpswap/hooks";
import { useIntervalStakingPoolInfo } from "hooks/staking-token/index";
import { useUSDPrice } from "hooks/useUSDPrice";
import { StakingState, type StakingPoolControllerPoolInfo } from "@icpswap/types";
import { getStateValue } from "utils/stake/index";
import { useApr } from "hooks/staking-token/useApr";
import { useTokenBalance } from "hooks/token";
import { useAccountPrincipal } from "store/auth/hooks";
import { formatDollarAmount, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";

interface TopLiveCardProps {
  pool: StakingPoolControllerPoolInfo;
}

function TopLiveCard({ pool }: TopLiveCardProps) {
  const history = useHistory();
  const principal = useAccountPrincipal();

  const [, stakeToken] = useToken(pool.stakingToken.address);
  const [, rewardToken] = useToken(pool.rewardToken.address);
  const rewardTokenPrice = useUSDPrice(rewardToken);
  const stakeTokenPrice = useUSDPrice(stakeToken);

  const [poolInfo] = useIntervalStakingPoolInfo(pool?.canisterId.toString());
  const { result: stakeTokenBalance } = useTokenBalance(pool.stakingToken.address, principal?.toString());

  const totalStakedValue = useMemo(() => {
    if (!rewardTokenPrice || !stakeToken || !poolInfo) return undefined;
    return parseTokenAmount(poolInfo.totalDeposit, stakeToken.decimals).multipliedBy(rewardTokenPrice).toString();
  }, [rewardTokenPrice, stakeToken, poolInfo]);

  const apr = useApr({
    poolInfo,
    rewardToken,
    rewardTokenPrice,
    stakeTokenPrice,
    stakeToken,
  });

  const handleClick = () => {
    history.push(`/stake/details/${pool.canisterId.toString()}`);
  };

  return (
    <MainCard
      level={1}
      padding="20px 16px"
      sx={{
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <Flex justify="space-between">
        <StakingTokenImages stakeToken={stakeToken} rewardToken={rewardToken} />
        <Typography fontSize={12}>
          {rewardToken && stakeToken && rewardToken ? (
            <Trans>
              Stake {stakeToken.symbol} to earn {rewardToken.symbol}
            </Trans>
          ) : (
            "--"
          )}
        </Typography>
      </Flex>

      <Flex justify="space-between" sx={{ margin: "12px 0 0 0" }}>
        <Box>
          <Typography fontSize={12}>
            <Trans>Reward Token</Trans>
          </Typography>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 500,
              color: "text.primary",
              margin: "6px 0 0 0",
            }}
          >
            {rewardToken ? rewardToken.symbol : "--"}
          </Typography>
        </Box>

        <Box>
          <Typography fontSize={12} align="right">
            <Trans>APR</Trans>
          </Typography>
          <Typography
            align="right"
            sx={{
              fontSize: "24px",
              fontWeight: 500,
              color: "text.primary",
              margin: "6px 0 0 0",
            }}
          >
            {apr ?? "--"}
          </Typography>
        </Box>
      </Flex>

      <Flex justify="space-between" sx={{ margin: "16px 0 0 0" }}>
        <Box>
          <Typography fontSize={12}>
            <Trans>Your Available to Stake</Trans>
          </Typography>
          <Flex gap="0 2px" sx={{ margin: "6px 0 0 0" }}>
            <Typography fontSize={16} color="text.primary">
              {stakeTokenBalance && stakeToken
                ? `${toSignificantWithGroupSeparator(
                    parseTokenAmount(stakeTokenBalance, stakeToken.decimals).toString(),
                  )} ${stakeToken.symbol}`
                : "--"}
            </Typography>
          </Flex>
        </Box>

        <Box>
          <Typography fontSize={12} align="right">
            <Trans>Total Staked</Trans>
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              color: "text.primary",
              margin: "6px 0 0 0",
              textAlign: "right",
            }}
          >
            {totalStakedValue ? `${formatDollarAmount(totalStakedValue)}` : "--"}
          </Typography>
        </Box>
      </Flex>
    </MainCard>
  );
}

export function TopLiveStaking() {
  const { result: allLivePools, loading } = useStakingPools(getStateValue(StakingState.LIVE), 0, 100);

  const topLivePools = useMemo(() => {
    if (!allLivePools) return undefined;

    return allLivePools.content.slice(0, 4);
  }, [allLivePools]);

  return (
    <MainCard>
      <Typography color="text.primary" sx={{ fontSize: "20px", fontWeight: 500 }}>
        <Trans>Top Live Pools</Trans>
      </Typography>

      <Box mt="24px">
        {loading ? (
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        ) : topLivePools?.length === 0 ? (
          <Flex justify="center">
            <NoData />
          </Flex>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: "0 20px",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              "@media(max-width: 640px)": {
                gridTemplateColumns: "1fr",
                gap: "20px 0",
              },
            }}
          >
            {topLivePools?.map((pool) => <TopLiveCard key={pool.canisterId.toString()} pool={pool} />)}
          </Box>
        )}
      </Box>
    </MainCard>
  );
}
