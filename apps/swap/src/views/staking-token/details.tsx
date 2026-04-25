import { Breadcrumbs } from "@icpswap/ui";
import { Flex, MainCard, type Tab, TabPanel } from "components/index";
import { Box, Typography, useTheme } from "components/Mui";
import {
  AprChart,
  MainContent,
  Reclaim,
  ReclaimContext,
  StakeDetails,
  StakingTokenImages,
} from "components/stake/index";
import { State } from "components/stake/State";
import { useRefreshTriggerManager } from "hooks/index";
import { useIntervalStakingPoolInfo } from "hooks/staking-token";
import { useToken } from "hooks/useCurrency";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

function ReclaimTab() {
  const { t } = useTranslation();
  const { reclaimable } = useContext(ReclaimContext);

  return (
    <Typography fontSize="inherit" component="div" sx={{ position: "relative" }}>
      {t("common.reclaim")}
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
  const { t } = useTranslation();
  const theme = useTheme();

  const [reclaimable, setReclaimable] = useState(false);
  const [tabKey, setTabKey] = useState<"stake" | "reclaim">("stake");

  const [refreshTrigger, setRefreshTrigger] = useRefreshTriggerManager("STAKE_DETAILS");

  const { id: poolId } = useParams<{ id: string }>();

  const [poolInfo] = useIntervalStakingPoolInfo(poolId);

  const [, stakeToken] = useToken(poolInfo?.stakingToken.address);
  const [, rewardToken] = useToken(poolInfo?.rewardToken.address);

  const rewardTokenPrice = useUSDPrice(rewardToken);

  const handleTabChange = (tab: Tab) => {
    setTabKey(tab.key);
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
            <AprChart canisterId={poolId} />

            <Box
              sx={{
                width: "548px",
                padding: "0 0 16px 0",
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
                    <Typography color="text.primary" fontSize={20} fontWeight={500} align="right">
                      {t("common.earn.symbol", { symbol: rewardToken?.symbol ?? "--" })}
                    </Typography>

                    <Typography align="right" mt="8px">
                      {t("stake", { symbol: stakeToken ? `${stakeToken.symbol}` : "--" })}
                    </Typography>
                  </Box>
                </Flex>

                {poolInfo ? (
                  <Flex justify="flex-end" sx={{ margin: "8px 0 0 0" }}>
                    <State poolInfo={poolInfo} />
                  </Flex>
                ) : null}

                <Box mt="24px">
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
                    handleRefresh={setRefreshTrigger}
                  />
                </Box>

                <Box sx={{ display: tabKey === "reclaim" ? "block" : "none" }}>
                  <Reclaim
                    poolId={poolId}
                    onReclaimSuccess={setRefreshTrigger}
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
          </Flex>
        </Box>
      </Flex>
    </ReclaimContext.Provider>
  );
}
