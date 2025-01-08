import { useState } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { MainCard, Flex, TabPanel, type Tab } from "components/index";
import { useIntervalUserFarmInfo } from "hooks/staking-farm";
import { useToken } from "hooks/useCurrency";
import { AnonymousPrincipal } from "constants/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { t, Trans } from "@lingui/macro";
import { useV3FarmRewardMetadata } from "@icpswap/hooks";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useParams } from "react-router-dom";
import { Breadcrumbs } from "@icpswap/ui";
import { FarmTokenImages, FarmDetails, FarmMain, Reclaim, FarmAprCharts } from "components/farm/index";
import { State } from "components/farm/State";

const tabs = [
  { key: "stake", value: "Stake" },
  { key: "reclaim", value: "Reclaim" },
];

export default function Farm() {
  const theme = useTheme();
  const principal = useAccountPrincipal();

  const [tabKey, setTabKey] = useState<"stake" | "reclaim">("stake");

  const { id: farmId } = useParams<{ id: string }>();

  const userFarmInfo = useIntervalUserFarmInfo(farmId, principal?.toString() ?? AnonymousPrincipal);

  const [, token0] = useToken(userFarmInfo?.poolToken0.address) ?? undefined;
  const [, token1] = useToken(userFarmInfo?.poolToken1.address) ?? undefined;
  const [, rewardToken] = useToken(userFarmInfo?.rewardToken.address) ?? undefined;

  const rewardTokenPrice = useUSDPrice(rewardToken);

  const { result: farmRewardMetadata } = useV3FarmRewardMetadata(farmId);

  const handleTabChange = (tab: Tab) => {
    setTabKey(tab.key);
  };

  return (
    <Flex sx={{ width: "100%", padding: "0 0 24px 0" }} justify="center">
      <Box sx={{ width: "100%", maxWidth: "1120px", margin: "16px 0 0 0" }}>
        <Breadcrumbs prevLabel={t`Farm`} currentLabel={t`Stake Positions`} prevLink="back" />

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
          <FarmAprCharts farmId={farmId} />

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
              padding="24px 24px"
              sx={{
                width: "100%",
                overflow: "hidden",
                height: "fit-content",
              }}
            >
              <Flex sx={{ width: "100%" }} justify="space-between">
                <FarmTokenImages
                  rewardToken={rewardToken}
                  token0={token0}
                  token1={token1}
                  rewardTokenSize="56px"
                  stakeTokenSize="32px"
                />

                <Box>
                  <Typography color="text.primary" fontSize={20} fontWeight={500} align="right">
                    <Trans>Earn {rewardToken?.symbol ?? "--"}</Trans>
                  </Typography>

                  <Typography align="right" mt="8px">
                    <Trans>Stake {token0 && token1 ? `${token0.symbol}/${token1.symbol}` : "--"} Positions</Trans>
                  </Typography>
                </Box>
              </Flex>

              <Flex justify="flex-end" sx={{ margin: "8px 0 0 0" }}>
                <State farmInfo={userFarmInfo} />
              </Flex>

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
                <FarmMain
                  farmId={farmId}
                  farmInfo={userFarmInfo}
                  rewardToken={rewardToken}
                  token0={token0}
                  token1={token1}
                  rewardMetadata={farmRewardMetadata}
                />
              </Box>

              <Box sx={{ display: tabKey === "reclaim" ? "block" : "none" }}>
                <Reclaim farmId={farmId} farmInfo={userFarmInfo} />
              </Box>
            </MainCard>

            <FarmDetails
              farmId={farmId}
              farmInfo={userFarmInfo}
              token0={token0}
              token1={token1}
              rewardToken={rewardToken}
              rewardTokenPrice={rewardTokenPrice}
              rewardMetadata={farmRewardMetadata}
            />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
