import { useState, useContext } from "react";
import { Box, Typography } from "components/Mui";
import { MainCard, Flex, TabPanel, type Tab } from "components/index";
import { useTheme } from "@mui/styles";
import { useToken } from "hooks/useCurrency";
import { t, Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useParams } from "react-router-dom";
import { Breadcrumbs } from "@icpswap/ui";
import {
  StakingTokenImages,
  MainContent,
  StakeDetails,
  Reclaim,
  ReclaimContext,
  AprChart,
} from "components/stake/index";
import { useIntervalStakingPoolInfo } from "hooks/staking-token";

function ReclaimTab() {
  const { reclaimable } = useContext(ReclaimContext);

  return (
    <Typography fontSize="inherit" component="div" sx={{ position: "relative" }}>
      <Trans>Reclaim</Trans>
      {reclaimable ? (
        <Box
          sx={{
            position: "absolute",
            top: "-5px",
            right: "-10px",
            width: "8px",
            height: "8px",
            background: "#D3625B",
            borderRadius: "50%",
          }}
        />
      ) : null}
    </Typography>
  );
}

const tabs = [
  { key: "stake", value: "Stake" },
  {
    key: "reclaim",
    value: <ReclaimTab />,
  },
];

export default function StakeDetail() {
  const theme = useTheme() as Theme;

  const [reclaimable, setReclaimable] = useState(false);
  const [tabKey, setTabKey] = useState<"stake" | "reclaim">("stake");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { id: poolId } = useParams<{ id: string }>();

  const [poolInfo] = useIntervalStakingPoolInfo(poolId);

  const [, stakeToken] = useToken(poolInfo?.stakingToken.address);
  const [, rewardToken] = useToken(poolInfo?.rewardToken.address);

  const rewardTokenPrice = useUSDPrice(rewardToken);

  const handleTabChange = (tab: Tab) => {
    setTabKey(tab.key);
  };

  const handleRefresh = () => {
    setRefreshTrigger(refreshTrigger + 1);
  };

  return (
    <ReclaimContext.Provider value={{ reclaimable, setReclaimable }}>
      <Flex sx={{ width: "100%" }} justify="center">
        <Box sx={{ width: "100%", maxWidth: "1120px", margin: "10px 0 0 0" }}>
          <Breadcrumbs prevLabel={t`Stake`} currentLabel={t`Stake Token`} prevLink="/stake" />

          <Flex
            sx={{
              margin: "30px 0 0 0",
              width: "100%",
              "@media(max-width: 640px)": {
                flexDirection: "column",
                gap: "12px 0",
                justifyContent: "flex-start",
                alignItems: "center",
              },
            }}
            justify="center"
            align="flex-start"
            gap="0 12px"
          >
            <Box
              sx={{
                width: "548px",
                "@media (max-width: 520px)": {
                  width: "100%",
                },
              }}
            >
              <MainCard
                borderRadius="16px"
                level={1}
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  height: "fit-content",
                }}
              >
                <Flex sx={{ width: "100%" }} justify="space-between">
                  <StakingTokenImages
                    rewardToken={rewardToken}
                    stakeToken={stakeToken}
                    rewardTokenSize="56px"
                    stakeTokenSize="32px"
                  />

                  <Box>
                    <Typography color="text.primary" fontSize={24} fontWeight={500} align="right">
                      <Trans>Earn {rewardToken?.symbol ?? "--"}</Trans>
                    </Typography>

                    <Typography fontSize={16} align="right" mt="12px">
                      <Trans>Stake {stakeToken ? `${stakeToken.symbol}` : "--"}</Trans>
                    </Typography>
                  </Box>
                </Flex>

                <Box mt="42px">
                  <TabPanel
                    fullWidth
                    fontNormal
                    fontSize="16px"
                    tabs={tabs}
                    bg0={theme.palette.background.level3}
                    bg1={theme.palette.background.level1}
                    onChange={handleTabChange}
                    active={tabKey}
                  />
                </Box>

                <Box sx={{ display: tabKey === "stake" ? "block" : "none" }}>
                  <MainContent
                    poolId={poolId}
                    poolInfo={poolInfo}
                    rewardToken={rewardToken}
                    stakeToken={stakeToken}
                    refreshTrigger={refreshTrigger}
                    handleRefresh={handleRefresh}
                  />
                </Box>

                <Box sx={{ display: tabKey === "reclaim" ? "block" : "none" }}>
                  <Reclaim
                    poolId={poolId}
                    onReclaimSuccess={handleRefresh}
                    rewardToken={rewardToken}
                    stakeToken={stakeToken}
                    refresh={tabKey === "reclaim"}
                  />
                </Box>
              </MainCard>

              <StakeDetails
                poolId={poolId}
                poolInfo={poolInfo}
                stakeToken={stakeToken}
                rewardToken={rewardToken}
                rewardTokenPrice={rewardTokenPrice}
              />
            </Box>

            <AprChart canisterId={poolId} />
          </Flex>
        </Box>
      </Flex>
    </ReclaimContext.Provider>
  );
}
