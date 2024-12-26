import { useMemo } from "react";
import { Typography, Box, useTheme } from "components/Mui";
import { MainCard, TokenImage } from "components/index";
import { Flex } from "@icpswap/ui";
import { BigNumber, formatDollarAmount, isNullArgs, nonNullArgs, numToPercent } from "@icpswap/utils";
import { Position } from "@icpswap/swap-sdk";
import { Trans } from "@lingui/macro";
import { useUSDPriceById } from "hooks/index";
import { usePositionValue } from "hooks/liquidity";

interface PositionValueProps {
  position: Position;
  positionId: string;
  isOwner: boolean;
}

export function PositionValue({ position }: PositionValueProps) {
  const theme = useTheme();
  const positionValue = usePositionValue({ position });

  const token0 = position.pool.token0;
  const token1 = position.pool.token1;
  const token0Amount = position.amount0.toExact();
  const token1Amount = position.amount1.toExact();
  const token0USDPrice = useUSDPriceById(token0.address);
  const token1USDPrice = useUSDPriceById(token1.address);
  const token0USDValue = useMemo(() => {
    if (isNullArgs(token0USDPrice)) return undefined;
    return new BigNumber(token0Amount).multipliedBy(token0USDPrice).toString();
  }, [token0USDPrice, token0Amount]);
  const token1USDValue = useMemo(() => {
    if (isNullArgs(token1USDPrice)) return undefined;
    return new BigNumber(token1Amount).multipliedBy(token1USDPrice).toString();
  }, [token1USDPrice, token1Amount]);

  const { token0Percent, token1Percent } = useMemo(() => {
    if (isNullArgs(token0USDValue) || isNullArgs(token1USDValue)) return {};

    const totalUSDValue = new BigNumber(token0USDValue).plus(token1USDValue);

    return {
      token0Percent: new BigNumber(token0USDValue).dividedBy(totalUSDValue).toString(),
      token1Percent: new BigNumber(token1USDValue).dividedBy(totalUSDValue).toString(),
    };
  }, [token0USDValue, token1USDValue]);

  return (
    <MainCard level={3}>
      <Flex vertical gap="20px 0" align="flex-start">
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          <Trans>Position Value</Trans>
        </Typography>

        <Typography color="text.primary" sx={{ fontWeight: 500, fontSize: "28px" }}>
          {positionValue ? formatDollarAmount(positionValue) : "--"}
        </Typography>

        <Flex fullWidth justify="space-between" align="flex-start">
          <Flex gap="0 6px">
            <TokenImage size="20px" logo={token0.logo} tokenId={token0.address} />
            <Typography>{token0.symbol}</Typography>
          </Flex>

          <Flex vertical gap="6px 0" align="flex-end">
            <Typography color="text.primary">{new BigNumber(token0Amount).toFormat()}</Typography>
            <Typography fontSize="12px">
              {nonNullArgs(token0USDValue) ? formatDollarAmount(token0USDValue) : "--"}
            </Typography>
          </Flex>
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-start">
          <Flex gap="0 6px">
            <TokenImage size="20px" logo={token1.logo} tokenId={token1.address} />
            <Typography>{token1.symbol}</Typography>
          </Flex>

          <Flex vertical gap="6px 0" align="flex-end">
            <Typography color="text.primary">{new BigNumber(token1Amount).toFormat()}</Typography>
            <Typography fontSize="12px">
              {nonNullArgs(token1USDValue) ? formatDollarAmount(token1USDValue) : "--"}
            </Typography>
          </Flex>
        </Flex>
      </Flex>

      <Flex vertical gap="26px 0" align="flex-start" sx={{ margin: "26px 0 0 0" }} fullWidth>
        {nonNullArgs(token0Percent) && nonNullArgs(token1Percent) ? (
          <Box sx={{ width: "100%" }}>
            <Flex fullWidth justify="space-between">
              <Flex gap="0 8px">
                <Typography color="text.primary">{numToPercent(token0Percent, 2)}</Typography>
                <Flex gap="0 6px">
                  <TokenImage size="16px" logo={token0.logo} tokenId={token0.address} />
                  <Typography color="text.primary">{token0.symbol}</Typography>
                </Flex>
              </Flex>

              <Flex gap="0 8px">
                <Typography color="text.primary">{numToPercent(token1Percent, 2)}</Typography>
                <Flex gap="0 6px">
                  <TokenImage size="16px" logo={token1.logo} tokenId={token1.address} />
                  <Typography color="text.primary">{token1.symbol}</Typography>
                </Flex>
              </Flex>
            </Flex>

            <Box sx={{ width: "100%", height: "8px", position: "relative", margin: "12px 0 0 0" }}>
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: numToPercent(token0Percent),
                  height: "8px",
                  borderTopLeftRadius: "12px",
                  borderBottomLeftRadius: "12px",
                  borderTopRightRadius: new BigNumber(token1Percent).isEqualTo(0) ? "12px" : "0px",
                  borderRightLeftRadius: new BigNumber(token1Percent).isEqualTo(0) ? "12px" : "0px",
                  background: "#C7C698",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  width: numToPercent(token1Percent),
                  height: "8px",
                  borderTopRightRadius: "12px",
                  borderBottomRightRadius: "12px",
                  borderTopLeftRadius: new BigNumber(token0Percent).isEqualTo(0) ? "12px" : "0px",
                  borderBottomLeftRadius: new BigNumber(token0Percent).isEqualTo(0) ? "12px" : "0px",
                  background: "#63D7B9",
                }}
              />

              {!new BigNumber(token0Percent).isEqualTo(0) && !new BigNumber(token1Percent).isEqualTo(0) ? (
                <Box
                  sx={{
                    position: "absolute",
                    left: numToPercent(token0Percent),
                    top: 0,
                    width: "2px",
                    height: "8px",
                    background: theme.palette.background.level3,
                    transform: "translate(-50%, 0)",
                  }}
                />
              ) : null}
            </Box>
          </Box>
        ) : null}
      </Flex>
    </MainCard>
  );
}
