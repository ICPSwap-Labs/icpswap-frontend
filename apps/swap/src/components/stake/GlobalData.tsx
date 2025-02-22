import { Typography, Box } from "components/Mui";
import { useStakeIntervalGlobalData, useUserStakedTokens, useInfoAllTokens } from "@icpswap/hooks";
import { Tooltip, Flex } from "components/index";
import React, { useMemo } from "react";
import { useICPPrice } from "store/global/hooks";
import { formatDollarAmount, BigNumber, nonNullArgs } from "@icpswap/utils";
import { useAccountPrincipal } from "store/auth/hooks";
import { useUserAvailableTokensValue } from "hooks/staking-token/useUserAvailableTokens";
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
          <Typography>{label0}</Typography>
          {tooltip0 ? <Tooltip tips={tooltip0} /> : null}
        </Flex>

        <Typography sx={{ margin: "16px 0 0 0", fontSize: "24px", fontWeight: 500, color: "text.primary" }}>
          {value0}
        </Typography>
      </Box>

      {value1 ? (
        <Box
          sx={{
            margin: "32px 0 0 0",
            "@media(max-width: 640px)": {
              margin: "16px 0 0 0",
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
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const icpPrice = useICPPrice();
  const { data } = useStakeIntervalGlobalData();
  const { result: userStakedTokens } = useUserStakedTokens(principal?.toString());
  const infoAllTokens = useInfoAllTokens();
  const { value: userAvailableTokensValue, tokens: availableTokensNumber } = useUserAvailableTokensValue();

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

  const allStakedTokensUSDValue = useMemo(() => {
    if (!userStakedTokens || !infoAllTokens) return undefined;

    const value = userStakedTokens.reduce((prev, curr) => {
      const infoToken = infoAllTokens.find((e) => e.address === curr.ledgerId.toString());

      if (curr.amount && infoToken) {
        return prev.plus(new BigNumber(curr.amount).multipliedBy(infoToken.priceUSD));
      }

      return prev;
    }, new BigNumber(0));

    return value.toString();
  }, [infoAllTokens, userStakedTokens]);

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
        label0={t("stake.your.available.tokens")}
        value0={
          nonNullArgs(userAvailableTokensValue) && nonNullArgs(availableTokensNumber) ? (
            <Typography sx={{ fontSize: "24px", fontWeight: 500 }} component="div">
              <Typography sx={{ fontSize: "24px", color: "text.primary", fontWeight: 500 }} component="span">
                {formatDollarAmount(userAvailableTokensValue)}
              </Typography>
              &nbsp;in&nbsp;
              <Typography sx={{ fontSize: "24px", color: "text.primary", fontWeight: 500 }} component="span">
                {availableTokensNumber}
              </Typography>
              &nbsp;tokens
            </Typography>
          ) : (
            "--"
          )
        }
        tooltip0={t`The number of tokens currently available in your account for staking.`}
        label1={t("stake.your.staked.tokens")}
        value1={
          nonNullArgs(allStakedTokensUSDValue) && nonNullArgs(userStakedTokens) ? (
            <Typography sx={{ fontSize: "24px", fontWeight: 500 }} component="div">
              <Typography sx={{ fontSize: "24px", color: "text.primary", fontWeight: 500 }} component="span">
                {formatDollarAmount(allStakedTokensUSDValue)}
              </Typography>
              &nbsp;in&nbsp;
              <Typography sx={{ fontSize: "24px", color: "text.primary", fontWeight: 500 }} component="span">
                {userStakedTokens.length}
              </Typography>
              &nbsp;pools
            </Typography>
          ) : (
            "--"
          )
        }
      />

      <Item
        label0={t("common.tvl")}
        value0={tvl ?? "--"}
        tooltip0={t("common.tvl.tips")}
        label1={t("common.total.rewarded.value")}
        value1={rewardedValue ?? "--"}
        tooltip1={t`The total value of rewards distributed by finished pools.`}
      />

      <Item
        label0={t("common.total.rewarding.value")}
        value0={rewardingValue ?? "--"}
        tooltip0={t("stake.total.value.rewards.descriptions")}
        label1={t("common.total.pools")}
        value1={totalPools ?? "--"}
        tooltip1={t("info.stake.total.pools.descriptions")}
      />
    </Box>
  );
}
