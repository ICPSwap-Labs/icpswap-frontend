import { t } from "@lingui/macro";
import { useFarmGlobalData } from "hooks/staking-farm/index";
import { Flex, Image } from "@icpswap/ui";
import { Typography } from "components/Mui";

import { Card, Item } from "../component";

export function Farm() {
  const globalData = useFarmGlobalData();

  return (
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
          label={t`TVL`}
          value={globalData.stakeTokenTVL}
          tooltip={t`The cumulative value of positions staked across all live farming pools.`}
        />
        <Item
          label={t`Total Rewarding Value`}
          value={globalData?.rewardTokenTVL ?? "--"}
          tooltip={t`The total value of rewards distributed by live farming pools.`}
        />

        <Item
          label={t`Total Rewarded Value`}
          value={globalData?.rewardedTokenTVL ?? "--"}
          tooltip={t`The total value of rewards distributed by finished farming pools.`}
        />
        <Item
          label={t`Total Pools`}
          value={globalData?.farmAmount?.toString() ?? "--"}
          tooltip={t`The total number of farming pools, including those that are unstart, live, and finished.`}
        />
      </Flex>
    </Card>
  );
}
