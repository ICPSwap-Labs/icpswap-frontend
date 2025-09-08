import { useMemo } from "react";
import { Box, Typography } from "components/Mui";
import { Flex, LoadingRow } from "@icpswap/ui";
import { BigNumber, formatDollarAmount, isUndefinedOrNull, numToPercent } from "@icpswap/utils";
import { AddressOverview, Null } from "@icpswap/types";

enum Colors {
  Token = "#8672FF",
  Lp = "#F7B231",
  Limit = "#4FB3EC",
  Stake = "#00C853",
  Farm = "#FF72AD",
}

enum Labels {
  Token = "Token",
  Lp = "LP positions",
  Limit = "Limit orders",
  Stake = "Staking pool",
  Farm = "Farm pool",
}

interface DistributionProps {
  addressOverview: AddressOverview | Null;
}

export function Distribution({ addressOverview }: DistributionProps) {
  const items = useMemo(() => {
    if (!addressOverview) return undefined;

    const totalValue = new BigNumber(addressOverview.tokenValue)
      .plus(addressOverview.positionValue)
      .plus(addressOverview.stakeValue)
      .plus(addressOverview.farmValue);

    return [
      {
        label: Labels.Token,
        value: addressOverview.tokenValue,
        color: Colors.Token,
        percent: new BigNumber(addressOverview.tokenValue).dividedBy(totalValue).toString(),
      },
      {
        label: Labels.Limit,
        value: addressOverview.limitOrderValue,
        color: Colors.Limit,
        percent: new BigNumber(addressOverview.limitOrderValue).dividedBy(totalValue).toString(),
      },
      {
        label: Labels.Lp,
        value: addressOverview.positionValue,
        color: Colors.Lp,
        percent: new BigNumber(addressOverview.positionValue).dividedBy(totalValue).toString(),
      },
      {
        label: Labels.Stake,
        value: addressOverview.stakeValue,
        color: Colors.Stake,
        percent: new BigNumber(addressOverview.stakeValue).dividedBy(totalValue).toString(),
      },
      {
        label: Labels.Farm,
        value: addressOverview.farmValue,
        color: Colors.Farm,
        percent: new BigNumber(addressOverview.farmValue).dividedBy(totalValue).toString(),
      },
    ];
  }, [addressOverview]);

  return (
    <Box sx={{ padding: "0 16px" }}>
      <Flex justify="space-between" fullWidth>
        <Typography sx={{ fontSize: "16px", color: "text.primary" }}>Distribution</Typography>
      </Flex>

      <Flex sx={{ margin: "32px 0 0 0 " }}>
        {isUndefinedOrNull(items) ? (
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        ) : (
          <Box sx={{ width: "100%" }}>
            <Flex gap="0 2px" fullWidth>
              {items.map(({ color, percent, label }) =>
                new BigNumber(percent).isEqualTo(0) ? null : (
                  <Box
                    key={label}
                    sx={{ width: numToPercent(percent), height: "6px", borderRadius: "40px", background: color }}
                  />
                ),
              )}
            </Flex>

            <Flex sx={{ margin: "24px 0 0 0 " }} vertical align="flex-start" gap="20px 0" fullWidth>
              {items.map(({ label, value, color }) => (
                <Flex justify="space-between" fullWidth key={label}>
                  <Flex gap="0 8px">
                    <Box sx={{ width: "6px", height: "6px", borderRadius: "50%", background: color }} />
                    <Typography color="text.primary" fontWeight={500}>
                      {label}
                    </Typography>
                  </Flex>
                  <Typography color="text.primary" fontWeight={500}>
                    {formatDollarAmount(value)}
                  </Typography>
                </Flex>
              ))}
            </Flex>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
