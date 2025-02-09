import { useContext, useEffect } from "react";
import { useFarmGlobalData } from "hooks/staking-farm/index";
import { Flex, Image, Link } from "@icpswap/ui";
import { Typography } from "components/Mui";
import { formatDollarAmount } from "@icpswap/utils";
import { useTranslation } from "react-i18next";

import { IcpswapContext } from "./context";
import { Card, Item } from "../component";

export function Farm() {
  const { t } = useTranslation();
  const { setFarmTVL } = useContext(IcpswapContext);
  const globalData = useFarmGlobalData();

  useEffect(() => {
    if (globalData) {
      setFarmTVL(globalData.stakeTokenTVL);
    }
  }, [setFarmTVL, globalData]);

  return (
    <Link to="/info-farm">
      <Card
        title={
          <Flex gap="0 12px">
            <Image src="/images/info/overview-farm.svg" sizes="40px" />

            <Typography color="text.primary" fontWeight={500} fontSize="18px">
              Farm
            </Typography>
          </Flex>
        }
      >
        <Flex vertical gap="32px 0" align="flex-start" sx={{ margin: "32px 0 0 0" }}>
          <Item
            label={t("common.tvl")}
            value={globalData.stakeTokenTVL ? formatDollarAmount(globalData.stakeTokenTVL) : "--"}
            tooltip={t`The cumulative value of positions staked across all live farming pools.`}
          />
          <Item
            label={t("common.total.rewarding.value")}
            value={globalData.rewardTokenTVL ? formatDollarAmount(globalData?.rewardTokenTVL) : "--"}
            tooltip={t`The total value of rewards distributed by live farming pools.`}
          />

          <Item
            label={t("common.total.rewarded.value")}
            value={globalData.rewardedTokenTVL ? formatDollarAmount(globalData.rewardedTokenTVL) : "--"}
            tooltip={t`The total value of rewards distributed by finished farming pools.`}
          />
          <Item
            label={t("common.total.pools")}
            value={globalData?.farmAmount?.toString() ?? "--"}
            tooltip={t`The total number of farming pools, including those that are unstart, live, and finished.`}
          />
        </Flex>
      </Card>
    </Link>
  );
}
