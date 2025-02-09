import { useContext, useEffect, useMemo } from "react";
import { formatDollarAmount, BigNumber } from "@icpswap/utils";
import { useStakeIntervalGlobalData } from "@icpswap/hooks";
import { Flex, Image, Link } from "@icpswap/ui";
import { useICPPrice } from "store/global/hooks";
import { Typography } from "components/Mui";
import { useTranslation } from "react-i18next";

import { Item, Card } from "../component";
import { IcpswapContext } from "./context";

export function Staking() {
  const { t } = useTranslation();
  const icpPrice = useICPPrice();
  const { setStakeTVL } = useContext(IcpswapContext);

  const { data } = useStakeIntervalGlobalData();

  const { tvl, tvlValue, rewardedValue, rewardingValue, totalPools } = useMemo(() => {
    if (!data || !icpPrice) return {};

    const tvlValue = new BigNumber(data.valueOfStaking).times(icpPrice).toNumber();

    const tvl = formatDollarAmount(tvlValue);
    const rewardedValue = formatDollarAmount(new BigNumber(data.valueOfRewarded).times(icpPrice).toNumber());
    const rewardingValue = formatDollarAmount(new BigNumber(data.valueOfRewardsInProgress).times(icpPrice).toNumber());

    return {
      tvl,
      rewardedValue,
      rewardingValue,
      totalPools: data.totalPools.toString(),
      totalStaker: data.totalStaker,
      tvlValue,
    };
  }, [data, icpPrice]);

  useEffect(() => {
    if (tvlValue) {
      setStakeTVL(tvlValue);
    }
  }, [tvlValue, setStakeTVL]);

  return (
    <Link to="/info-stake">
      <Card
        title={
          <Flex gap="0 12px">
            <Image src="/images/info/overview-stake.svg" sizes="40px" />

            <Typography color="text.primary" fontWeight={500} fontSize="18px">
              Stake
            </Typography>
          </Flex>
        }
      >
        <Flex vertical gap="32px 0" align="flex-start" sx={{ margin: "32px 0 0 0" }}>
          <Item
            label={t("common.tvl")}
            value={tvl ?? "--"}
            tooltip={t`The cumulative value of tokens staked across all live pools.`}
          />
          <Item
            label={t("common.total.rewarding.value")}
            value={rewardingValue ?? "--"}
            tooltip={t`The total value of rewards distributed by live pools.`}
          />

          <Item
            label={t("common.total.rewarded.value")}
            value={rewardedValue ?? "--"}
            tooltip={t`The total value of rewards distributed by finished pools.`}
          />
          <Item
            label={t("common.total.pools")}
            value={totalPools ?? "--"}
            tooltip={t`The total number of pools, including those that are unstart, live, and finished.`}
          />
        </Flex>
      </Card>
    </Link>
  );
}
