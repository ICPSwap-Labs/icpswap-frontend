import { useMemo } from "react";
import { Typography, Box, Button, useTheme } from "components/Mui";
import {
  formatDollarAmount,
  nanosecond2Millisecond,
  toSignificantWithGroupSeparator,
  formatTokenAmount,
  parseTokenAmount,
  BigNumber,
} from "@icpswap/utils";
import { Modal, Line } from "@icpswap/ui";
import { Position } from "@icpswap/swap-sdk";
import { Flex, TokenImage, Tooltip } from "components/index";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { ArrowDown } from "react-feather";
import dayjs from "dayjs";
import { useLimitDetails } from "hooks/swap/limit-order/index";
import { useUserUnusedBalance, useTokenBalance } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { SubAccount } from "@dfinity/ledger-icp";
import { useSwapTokenFeeCost } from "hooks/swap/index";
import { LimitOrder } from "@icpswap/types";
import { useTranslation } from "react-i18next";

import { LimitDealRatio } from "./LimitDealRatio";

export interface LimitDetailsProps {
  open: boolean;
  position: Position;
  onClose: () => void;
  onCancelLimit: () => void;
  order: LimitOrder;
}

export function LimitDetails({ open, position, order, onClose, onCancelLimit }: LimitDetailsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const principal = useAccountPrincipal();

  const {
    pool: { id: poolId, token0 },
  } = position;

  const { timestamp, tickLimit } = order;

  const { inputToken, outputToken, limitPrice, currentPrice, inputAmount, outputAmount } = useLimitDetails({
    position,
    tickLimit,
    limit: order,
  });

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
    amount: formatTokenAmount(inputAmount?.toExact(), inputToken?.decimals).toString(),
  });

  return (
    <Modal open={open} title={t("swap.limit.order.details")} onClose={onClose} background="level1">
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
              {t("limit.pending")}
            </Typography>

            <Typography sx={{ fontSize: "12px", margin: "8px 0 0 0" }}>
              {dayjs(nanosecond2Millisecond(timestamp)).format("YYYY-MM-DD HH:mm")}
            </Typography>
          </Box>
        </Flex>

        <Line />

        <Flex vertical gap="16px 0" align="flex-start">
          <Flex gap="0 12px">
            <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="40px" />
            <Typography sx={{ fontSize: "24px", color: "text.primary", fontWeight: 500 }}>
              {inputAmount ? toSignificantWithGroupSeparator(inputAmount.toExact()) : "--"} {inputToken?.symbol}
            </Typography>
          </Flex>

          <Flex sx={{ width: "40px", height: "24px" }} justify="center">
            <ArrowDown color={theme.palette.text.secondary} />
          </Flex>

          <Flex gap="0 12px">
            <TokenImage tokenId={outputToken?.address} logo={outputToken?.logo} size="40px" />
            <Typography sx={{ fontSize: "24px", color: "text.primary", fontWeight: 500 }}>
              {outputAmount ? toSignificantWithGroupSeparator(outputAmount.toExact()) : "--"} {outputToken?.symbol}
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
                {t("common.filled")}
              </Typography>
            </Flex>

            <LimitDealRatio position={position} limit={order} />
          </Flex>

          <Flex fullWidth justify="space-between" gap="0 12px">
            <Flex gap="0 4px" sx={{ "@media(max-width: 640px)": { maxWidth: "128px" } }}>
              <Typography
                sx={{
                  "@media(max-width: 640px)": { fontSize: "12px", maxWidth: "112px" },
                }}
              >
                {t("common.limit.price")}
              </Typography>
              <Tooltip tips={t("common.limit.price.tips")} iconSize="14px" />
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
                {t("common.current.price")}
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
                {t("limit.estimated.earning")}
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
                    new BigNumber(outputAmount.toExact()).multipliedBy(0.003).multipliedBy(0.8).toString(),
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
                {t("limit.estimated.fee")}
                <Box sx={{ display: "inline-block", cursor: "pointer", margin: "0 0 0 4px", verticalAlign: "top" }}>
                  <Tooltip tips={t("limit.estimated.fee.tips")} iconSize="14px" />
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
          {t("limit.cancel")}
        </Button>
      </Flex>
    </Modal>
  );
}
