import { Typography, Box } from "components/Mui";
import { Flex, LoadingRow, MainCard, NoData } from "@icpswap/ui";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { useTranslation } from "react-i18next";

interface TopLiveCardProps {
  pool: StakingPoolControllerPoolInfo;
}

function TopLiveCard({ pool }: TopLiveCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const principal = useAccountPrincipal();

  const [, stakeToken] = useToken(pool.stakingToken.address);
  const [, rewardToken] = useToken(pool.rewardToken.address);
  const rewardTokenPrice = useUSDPrice(rewardToken);
  const stakeTokenPrice = useUSDPrice(stakeToken);

  const [poolInfo] = useIntervalStakingPoolInfo(pool?.canisterId.toString());
  const { result: stakeTokenBalance } = useTokenBalance(pool.stakingToken.address, principal?.toString());

  const totalStakedValue = useMemo(() => {
    if (!stakeTokenPrice || !stakeToken || !poolInfo) return undefined;
    return parseTokenAmount(poolInfo.totalDeposit, stakeToken.decimals).multipliedBy(stakeTokenPrice).toString();
  }, [stakeTokenPrice, stakeToken, poolInfo]);

  const apr = useApr({
    poolInfo,
    rewardToken,
    rewardTokenPrice,
    stakeTokenPrice,
    stakeToken,
  });

  const handleClick = () => {
    navigate(`/stake/details/${pool.canisterId.toString()}`);
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
      <Flex justify="space-between" gap="0 20px">
        <StakingTokenImages stakeToken={stakeToken} rewardToken={rewardToken} />
        <Typography fontSize={12} textAlign="right" lineHeight="18px">
          {rewardToken && stakeToken && rewardToken
            ? t("stake.to.earn", { symbol0: stakeToken.symbol, symbol1: rewardToken.symbol })
            : "--"}
        </Typography>
      </Flex>

      <Flex justify="space-between" sx={{ margin: "12px 0 0 0" }} gap="0 8px">
        <Box style={{ maxWidth: "123px" }}>
          <Typography fontSize={12}>{t("common.reward.token")}</Typography>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 500,
              color: "text.primary",
              margin: "6px 0 0 0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={rewardToken?.symbol ?? ""}
          >
            {rewardToken ? rewardToken.symbol : "--"}
          </Typography>
        </Box>

        <Box>
          <Typography fontSize={12} align="right">
            {t("common.apr")}
          </Typography>
          <Typography
            align="right"
            sx={{
              maxWidth: "108px",
              fontSize: "24px",
              fontWeight: 500,
              color: "text.primary",
              margin: "6px 0 0 0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={apr ?? ""}
          >
            {apr ?? "--"}
          </Typography>
        </Box>
      </Flex>

      <Flex justify="space-between" sx={{ margin: "16px 0 0 0" }} gap="0 8px">
        <Box sx={{ maxWidth: "150px" }}>
          <Typography fontSize={12}>{t("common.your.available.stake")}</Typography>
          <Flex gap="0 2px" sx={{ margin: "6px 0 0 0" }}>
            <Typography
              sx={{
                color: "text.primary",
                fontSize: "16px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={
                stakeTokenBalance && stakeToken
                  ? `${toSignificantWithGroupSeparator(
                      parseTokenAmount(stakeTokenBalance, stakeToken.decimals).toString(),
                    )} ${stakeToken.symbol}`
                  : ""
              }
            >
              {stakeTokenBalance && stakeToken
                ? `${toSignificantWithGroupSeparator(
                    parseTokenAmount(stakeTokenBalance, stakeToken.decimals).toString(),
                  )} ${stakeToken.symbol}`
                : "--"}
            </Typography>
          </Flex>
        </Box>

        <Box sx={{ maxWidth: "81px" }}>
          <Typography fontSize={12} align="right">
            {t("stake.total.staked")}
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              color: "text.primary",
              margin: "6px 0 0 0",
              textAlign: "right",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={totalStakedValue ? `${formatDollarAmount(totalStakedValue)}` : ""}
          >
            {totalStakedValue ? `${formatDollarAmount(totalStakedValue)}` : "--"}
          </Typography>
        </Box>
      </Flex>
    </MainCard>
  );
}

export function TopLiveStaking() {
  const { t } = useTranslation();
  const { result: allLivePools, loading } = useStakingPools(getStateValue(StakingState.LIVE), 0, 100);

  const topLivePools = useMemo(() => {
    if (!allLivePools) return undefined;

    return allLivePools.content.slice(0, 4);
  }, [allLivePools]);

  return (
    <MainCard>
      <Typography color="text.primary" sx={{ fontSize: "18px", fontWeight: 500 }}>
        {t("stake.top.live.pools")}
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
