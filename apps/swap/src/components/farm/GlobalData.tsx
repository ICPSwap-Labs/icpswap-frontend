import { Typography, Box } from "components/Mui";
import { useFarmGlobalData } from "hooks/staking-farm";
import { Tooltip, Flex } from "components/index";
import React from "react";
import { formatDollarAmount, nonNullArgs } from "@icpswap/utils";
import { useTranslation } from "react-i18next";

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
          <Typography component="div">{label0}</Typography>
          {tooltip0 ? <Tooltip tips={tooltip0} /> : null}
        </Flex>

        <Typography
          sx={{ margin: "16px 0 0 0", fontSize: "24px", fontWeight: 500, color: "text.primary" }}
          component="div"
        >
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
            <Typography component="div">{label1}</Typography>
            {tooltip1 ? <Tooltip tips={tooltip1} /> : null}
          </Flex>

          <Typography
            sx={{ margin: "16px 0 0 0", fontSize: "28px", fontWeight: 500, color: "text.primary" }}
            component="div"
          >
            {value1}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}

export function GlobalData() {
  const { t } = useTranslation();
  const globalData = useFarmGlobalData();

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gap: "0 56px",
        gridTemplateColumns: "repeat(4, 1fr)",
        alignItems: "flex-end",
        "@media(max-width: 960px)": {
          gridTemplateColumns: "1fr",
          gap: "16px 0",
        },
      }}
    >
      <Item
        label0={t("farm.available.positions")}
        value0={
          nonNullArgs(globalData.userPositionAmount) && nonNullArgs(globalData.userPositionValue) ? (
            <Typography sx={{ fontSize: "24px", fontWeight: 500 }} component="div">
              <Typography sx={{ fontSize: "24px", color: "text.primary", fontWeight: 500 }} component="span">
                {formatDollarAmount(globalData.userPositionValue)}
              </Typography>
              &nbsp;in&nbsp;
              <Typography sx={{ fontSize: "24px", color: "text.primary", fontWeight: 500 }} component="span">
                {globalData.userPositionAmount}
              </Typography>
              &nbsp;positions
            </Typography>
          ) : (
            "--"
          )
        }
        tooltip0={t`The number of positions currently available in your account for staking.`}
        label1={t("farm.staked.positions")}
        value1={
          nonNullArgs(globalData.userStakedFarms) && nonNullArgs(globalData.userStakedTvl) ? (
            <Typography sx={{ fontSize: "24px", fontWeight: 500 }} component="div">
              <Typography sx={{ fontSize: "24px", color: "text.primary", fontWeight: 500 }} component="span">
                {formatDollarAmount(globalData.userStakedTvl)}
              </Typography>
              &nbsp;in&nbsp;
              <Typography sx={{ fontSize: "24px", color: "text.primary", fontWeight: 500 }} component="span">
                {globalData.userStakedFarms.length}
              </Typography>
              &nbsp;farms
            </Typography>
          ) : (
            "--"
          )
        }
      />

      <Item
        label0={t("common.tvl")}
        value0={globalData.stakeTokenTVL ? formatDollarAmount(globalData.stakeTokenTVL) : "--"}
        tooltip0={t`The cumulative value of positions staked across all live farming pools.`}
        label1={t("common.total.rewarded.value")}
        value1={globalData.rewardedTokenTVL ? formatDollarAmount(globalData.rewardedTokenTVL) : "--"}
        tooltip1={t`The total value of rewards distributed by finished farming pools.`}
      />

      <Item
        label0={t("common.total.rewarding.value")}
        value0={globalData.rewardTokenTVL ? formatDollarAmount(globalData.rewardTokenTVL) : "--"}
        tooltip0={t`The total value of rewards distributed by live farming pools.`}
        label1={t("common.total.pools")}
        value1={globalData.farmAmount?.toString() ?? "--"}
        tooltip1={t`The total number of farming pools, including those that are unstart, live, and finished.`}
      />
    </Box>
  );
}
