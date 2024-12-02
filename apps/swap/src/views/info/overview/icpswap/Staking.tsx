import { useMemo } from "react";
import { t } from "@lingui/macro";
import { formatDollarAmount, BigNumber } from "@icpswap/utils";
import { useStakeIntervalGlobalData } from "@icpswap/hooks";
import { Flex, Image, Link } from "@icpswap/ui";
import { useICPPrice } from "store/global/hooks";
import { Typography } from "components/Mui";

import { Item, Card } from "../component";

export function Staking() {
  const icpPrice = useICPPrice();

  const { data } = useStakeIntervalGlobalData();

  const { tvl, rewardedValue, rewardingValue, totalPools } = useMemo(() => {
    if (!data || !icpPrice) return {};

    const tvl = formatDollarAmount(new BigNumber(data.valueOfStaking).times(icpPrice).toNumber());
    const rewardedValue = formatDollarAmount(new BigNumber(data.valueOfRewarded).times(icpPrice).toNumber());
    const rewardingValue = formatDollarAmount(new BigNumber(data.valueOfRewardsInProgress).times(icpPrice).toNumber());

    return {
      tvl,
      rewardedValue,
      rewardingValue,
      totalPools: data.totalPools.toString(),
      totalStaker: data.totalStaker,
    };
  }, [data, icpPrice]);

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
            label={t`TVL`}
            value={tvl ?? "--"}
            tooltip={t`The cumulative value of tokens staked across all live pools.`}
          />
          <Item
            label={t`Total Rewarding Value`}
            value={rewardingValue ?? "--"}
            tooltip={t`The total value of rewards distributed by live pools.`}
          />

          <Item
            label={t`Total Rewarded Value`}
            value={rewardedValue ?? "--"}
            tooltip={t`The total value of rewards distributed by finished pools.`}
          />
          <Item
            label={t`Total Pools`}
            value={totalPools ?? "--"}
            tooltip={t`The total number of pools, including those that are unstart, live, and finished.`}
          />
        </Flex>
      </Card>
    </Link>
  );
}
