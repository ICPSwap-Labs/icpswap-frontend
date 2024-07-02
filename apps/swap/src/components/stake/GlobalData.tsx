import { Typography, Box } from "components/Mui";
import { useStakeIntervalGlobalData } from "@icpswap/hooks";
import { Trans, t } from "@lingui/macro";
import { Tooltip, Flex } from "components/index";
import React, { useMemo } from "react";
import { useICPPrice } from "store/global/hooks";
import { formatDollarAmount, BigNumber } from "@icpswap/utils";

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

        <Typography sx={{ margin: "16px 0 0 0", fontSize: "28px", fontWeight: 500, color: "text.primary" }}>
          {value0}
        </Typography>
      </Box>

      {value1 ? (
        <Box
          sx={{
            margin: "50px 0 0 0",
            "@media(max-width: 640px)": {
              margin: "29px 0 0 0",
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
  const icpPrice = useICPPrice();
  const { data } = useStakeIntervalGlobalData();

  const { tvl, rewardedValue, rewardingValue, totalPools } = useMemo(() => {
    if (!data || !icpPrice) return {};

    const tvl = formatDollarAmount(new BigNumber(data.valueOfStaking).times(icpPrice).toNumber());
    const rewardedValue = formatDollarAmount(new BigNumber(data.valueOfRewarded).times(icpPrice).toNumber());
    const rewardingValue = formatDollarAmount(new BigNumber(data.valueOfRewardsInProgress).times(icpPrice).toNumber());

    return { tvl, rewardedValue, rewardingValue, totalPools: data.totalPools.toString() };
  }, [data, icpPrice]);

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
          gap: "29px 0",
        },
      }}
    >
      <Item
        label0={<Trans>TVL</Trans>}
        value0={tvl ?? "--"}
        tooltip0={t`The cumulative value of tokens staked across all live pools.`}
        label1={<Trans>Total Rewarded Value</Trans>}
        value1={rewardedValue ?? "--"}
        tooltip1={t`The total value of rewards distributed by finished pools.`}
      />

      <Item
        label0={<Trans>Total Rewarding Value</Trans>}
        value0={rewardingValue ?? "--"}
        tooltip0={t`The total value of rewards distributed by live pools.`}
        label1={<Trans>Total Pools</Trans>}
        value1={totalPools ?? "--"}
        tooltip1={t`The total number of pools, including those that are unstart, live, and finished.`}
      />

      <Item
        label0={<Trans>Total Stakers</Trans>}
        value0={rewardingValue ?? "--"}
        tooltip0={t`The total number of unique accounts that have staked in the pools.`}
      />
    </Box>
  );
}
