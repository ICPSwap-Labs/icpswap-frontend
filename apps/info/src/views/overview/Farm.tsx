import { Box } from "@mui/material";
import { t } from "@lingui/macro";
import { useFarmGlobalData } from "hooks/staking-farm/index";

import { Card, Title, Item, Row } from "./component";

export function Farm() {
  const globalData = useFarmGlobalData();

  return (
    <Card>
      <Title title="Farms" to="/farm" />

      <Row>
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
      </Row>

      <Row>
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
      </Row>

      <Box sx={{ display: "flex" }}>
        <Item
          label={t`Total Stakers`}
          value={globalData.principalAmount?.toString() ?? "--"}
          tooltip={t`The total number of unique accounts that have staked in the farming pools.`}
        />
      </Box>
    </Card>
  );
}
