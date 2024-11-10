import { useMemo } from "react";
import { Typography, Box, Button, useTheme } from "components/Mui";
import {
  formatDollarAmount,
  nanosecond2Millisecond,
  toSignificantWithGroupSeparator,
  formatTokenAmount,
  parseTokenAmount,
  BigNumber,
  isNullArgs,
  nonNullArgs,
} from "@icpswap/utils";
import { Modal, Line } from "@icpswap/ui";
import { Position } from "@icpswap/swap-sdk";
import { t, Trans } from "@lingui/macro";
import { Flex, TokenImage, Tooltip } from "components/index";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { ArrowDown } from "react-feather";
import dayjs from "dayjs";
import { useLimitDetails } from "hooks/swap/limit-order/index";
import { useUserUnusedBalance, useTokenBalance } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { SubAccount } from "@dfinity/ledger-icp";
import { useSwapTokenFeeCost } from "hooks/swap/index";
import { LimitOrder as LimitOrderType, Null, Override } from "@icpswap/types";

export interface LimitDetailsProps {
  open: boolean;
  position: Position;
  onClose: () => void;
  onCancelLimit: () => void;
  order: Override<LimitOrderType, { poolId: string | Null }>;
}

export function LimitDetails({ open, position, order, onClose, onCancelLimit }: LimitDetailsProps) {
  const theme = useTheme();
  const principal = useAccountPrincipal();

  const {
    pool: { id: poolId, token0 },
  } = position;

  const { timestamp, token0InAmount, token1InAmount, tickLimit } = order;

  const { inputToken, outputToken, limitPrice, currentPrice } = useLimitDetails({
    position,
    tickLimit,
  });

  const inputAmount = useMemo(() => {
    if (isNullArgs(inputToken)) return null;
    return new BigNumber(token0InAmount.toString()).isEqualTo(0)
      ? parseTokenAmount(token1InAmount, inputToken.decimals).toString()
      : parseTokenAmount(token0InAmount, inputToken.decimals).toString();
  }, [token0InAmount, token1InAmount, inputToken]);

  const outputAmount = useMemo(() => {
    if (nonNullArgs(limitPrice) && nonNullArgs(outputToken) && nonNullArgs(inputAmount)) {
      return new BigNumber(inputAmount).multipliedBy(limitPrice.toFixed(outputToken.decimals)).toString();
    }
  }, [inputAmount, limitPrice, outputToken]);

  const inputTokenPrice = useUSDPriceById(inputToken?.address);

  const sub = useMemo(() => {
    return principal ? SubAccount.fromPrincipal(principal).toUint8Array() : undefined;
  }, [principal]);

  const { result: inputTokenSubBalance } = useTokenBalance({
    canisterId: inputToken?.address,
    address: poolId,
    sub,
  });

  const { result: unusedBalance } = useUserUnusedBalance(poolId, principal);
  const { result: inputTokenBalance } = useTokenBalance({
    canisterId: inputToken?.address,
    address: principal,
  });

  const swapFeeCost = useSwapTokenFeeCost({
    token: inputToken,
    subAccountBalance: inputTokenSubBalance,
    tokenBalance: inputTokenBalance,
    unusedBalance: inputToken?.address === token0.address ? unusedBalance?.balance0 : unusedBalance?.balance1,
    amount: formatTokenAmount(inputAmount?.toString(), inputToken?.decimals).toString(),
  });

  return (
    <Modal open={open} title={t`Limit Order Details`} onClose={onClose} background="level1">
      <Flex vertical align="flex-start" gap="24px 0" fullWidth>
        <Flex gap="0 12px">
          <Flex>
            <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="32px" />
            <TokenImage
              tokenId={outputToken?.address}
              logo={outputToken?.logo}
              size="32px"
              sx={{ margin: "0 0 0 -6px" }}
            />
          </Flex>

          <Box>
            <Typography color="text.primary" fontSize="16px">
              Limit pending
            </Typography>

            <Typography sx={{ fontSize: "12px", margin: "8px 0 0 0" }}>
              {dayjs(nanosecond2Millisecond(timestamp)).format("MM/DD/YYYY h:mm A")}
            </Typography>
          </Box>
        </Flex>

        <Line />

        <Flex vertical gap="16px 0" align="flex-start">
          <Flex gap="0 12px">
            <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="40px" />
            <Typography sx={{ fontSize: "24px", color: "text.primary", fontWeight: 500 }}>
              {inputAmount ? toSignificantWithGroupSeparator(inputAmount.toString()) : "--"} {inputToken?.symbol}
            </Typography>
          </Flex>

          <Flex sx={{ width: "40px", height: "24px" }} justify="center">
            <ArrowDown color={theme.palette.text.secondary} />
          </Flex>

          <Flex gap="0 12px">
            <TokenImage tokenId={outputToken?.address} logo={outputToken?.logo} size="40px" />
            <Typography sx={{ fontSize: "24px", color: "text.primary", fontWeight: 500 }}>
              {outputAmount ? toSignificantWithGroupSeparator(outputAmount) : "--"} {outputToken?.symbol}
            </Typography>
          </Flex>
        </Flex>

        <Line />

        <Flex vertical align="flex-start" gap="16px 0" fullWidth>
          <Flex fullWidth justify="space-between" gap="0 12px">
            <Flex gap="0 4px" sx={{ "@media(max-width: 640px)": { maxWidth: "128px" } }}>
              <Typography
                sx={{
                  "@media(max-width: 640px)": { fontSize: "12px", maxWidth: "112px" },
                }}
              >
                <Trans>Limit Price</Trans>
              </Typography>
              <Tooltip tips={t`Limit price is the set price for buying or selling your token.`} iconSize="14px" />
            </Flex>

            <Typography
              sx={{ color: "text.primary", textAlign: "right", "@media(max-width: 640px)": { fontSize: "12px" } }}
            >
              {inputToken && outputToken && limitPrice
                ? `1 ${inputToken.symbol} = ${limitPrice.toSignificant()} ${outputToken.symbol} ${
                    inputTokenPrice ? `(${formatDollarAmount(inputTokenPrice)})` : ""
                  }`
                : "--"}
            </Typography>
          </Flex>

          <Flex fullWidth justify="space-between" gap="0 12px">
            <Flex gap="0 4px" sx={{ "@media(max-width: 640px)": { maxWidth: "128px" } }}>
              <Typography
                sx={{
                  "@media(max-width: 640px)": { fontSize: "12px" },
                }}
              >
                <Trans>Current Price</Trans>
              </Typography>
            </Flex>

            <Typography
              sx={{ color: "text.primary", textAlign: "right", "@media(max-width: 640px)": { fontSize: "12px" } }}
            >
              {inputToken && outputToken && currentPrice
                ? `1 ${inputToken.symbol} = ${currentPrice.toSignificant()} ${outputToken.symbol}`
                : "--"}
            </Typography>
          </Flex>

          <Flex fullWidth justify="space-between" gap="0 12px" align="flex-start">
            <Flex sx={{ "@media(max-width: 640px)": { maxWidth: "128px" } }}>
              <Typography
                sx={{
                  lineHeight: "14px",
                  "@media(max-width: 640px)": { fontSize: "12px", maxWidth: "112px" },
                }}
                component="div"
              >
                <Trans>Estimated trading fee earnings</Trans>
                <Box sx={{ display: "inline-block", cursor: "pointer", margin: "0 0 0 4px", verticalAlign: "top" }}>
                  <Tooltip
                    iconSize="14px"
                    tips={t`When you place a limit order on ICPSwap, it's like adding a very narrow liquidity position. If your limit order is fully executed, you'll earn at least the minimum amount of transaction fees displayed.`}
                  />
                </Box>
              </Typography>
            </Flex>

            <Typography sx={{ color: "text.primary", "@media(max-width: 640px)": { fontSize: "12px" } }}>
              {outputToken && outputAmount
                ? `${toSignificantWithGroupSeparator(
                    new BigNumber(outputAmount).multipliedBy(0.003).multipliedBy(0.8).toString(),
                  )} ${outputToken.symbol}`
                : "--"}
            </Typography>
          </Flex>

          <Flex fullWidth justify="space-between" gap="0 12px" align="flex-start">
            <Flex gap="0 4px" sx={{ "@media(max-width: 640px)": { maxWidth: "128px" } }}>
              <Typography
                sx={{
                  lineHeight: "14px",
                  "@media(max-width: 640px)": { fontSize: "12px", maxWidth: "112px" },
                }}
                component="div"
              >
                <Trans>Estimated transfer fee for limit order</Trans>
                <Box sx={{ display: "inline-block", cursor: "pointer", margin: "0 0 0 4px", verticalAlign: "top" }}>
                  <Tooltip
                    tips={t`Each order requires the transfer fee, determined by the token's canister.`}
                    iconSize="14px"
                  />
                </Box>
              </Typography>
            </Flex>

            <Typography sx={{ color: "text.primary", "@media(max-width: 640px)": { fontSize: "12px" } }}>
              {swapFeeCost && inputToken && inputTokenPrice
                ? `${parseTokenAmount(swapFeeCost, inputToken.decimals).toFormat()} ${
                    inputToken.symbol
                  } (${formatDollarAmount(
                    parseTokenAmount(swapFeeCost, inputToken.decimals).multipliedBy(inputTokenPrice).toString(),
                  )})`
                : "--"}
            </Typography>
          </Flex>
        </Flex>

        <Button variant="contained" className="secondary" size="large" fullWidth onClick={onCancelLimit}>
          {t`Cancel Limit`}
        </Button>
      </Flex>
    </Modal>
  );
}
