import { Typography, Box } from "components/Mui";
import { useFarmGlobalData } from "hooks/staking-farm";
import { Trans, t } from "@lingui/macro";
import { Tooltip, Flex } from "components/index";
import React from "react";

interface ItemProps {
  label0: React.ReactNode;
  value0: React.ReactNode;
  label1?: React.ReactNode;
  value1?: React.ReactNode;
  tooltip0?: string;
  tooltip1?: string;
}

function Item({ label0, label1, value0, value1, tooltip0, tooltip1 }: ItemProps) {
  return (
    <Box>
      <Box>
        <Flex gap="0 4px">
          <Typography>{label0}</Typography>
          {tooltip0 ? <Tooltip tips={tooltip0} /> : null}
        </Flex>

        <Typography sx={{ margin: "16px 0 0 0", fontSize: "24px", fontWeight: 500, color: "text.primary" }}>
          {value0}
        </Typography>
      </Box>

      {value1 && label1 ? (
        <Box
          sx={{
            margin: "32px 0 0 0",
            "@media(max-width: 640px)": {
              margin: "18px 0 0 0",
            },
          }}
        >
          <Flex gap="0 4px">
            <Typography>{label1}</Typography>
            {tooltip1 ? <Tooltip tips={tooltip1} /> : null}
          </Flex>

          <Typography sx={{ margin: "16px 0 0 0", fontSize: "28px", fontWeight: 500, color: "text.primary" }}>
            {value1}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}

export function GlobalData() {
  const globalData = useFarmGlobalData();

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gap: "0 56px",
        gridTemplateColumns: "290px 290px 290px",
        alignItems: "flex-end",
        "@media(max-width: 960px)": {
          gridTemplateColumns: "1fr",
          gap: "16px 0",
        },
      }}
    >
      <Item
        label0={<Trans>TVL</Trans>}
        value0={globalData?.stakeTokenTVL ?? "--"}
        tooltip0={t`The cumulative value of positions staked across all live farming pools.`}
        label1={<Trans>Total Rewarded Value</Trans>}
        value1={globalData?.rewardedTokenTVL ?? "--"}
        tooltip1={t`The total value of rewards distributed by finished farming pools.`}
      />

      <Item
        label0={<Trans>Total Rewarding Value</Trans>}
        value0={globalData?.rewardTokenTVL ?? "--"}
        tooltip0={t`The total value of rewards distributed by live farming pools.`}
        label1={<Trans>Total Pools</Trans>}
        value1={globalData?.poolsNumber ?? "--"}
        tooltip1={t`The total number of farming pools, including those that are unstart, live, and finished.`}
      />

      <Item
        label0={<Trans>Total Stakers</Trans>}
        value0={globalData.principalAmount?.toString() ?? "--"}
        tooltip0={t`The total number of unique accounts that have staked in the farming pools.`}
      />
    </Box>
  );
}
