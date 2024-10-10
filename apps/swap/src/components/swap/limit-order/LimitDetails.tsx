import { useMemo } from "react";
import { Typography, Box, Button, useTheme } from "components/Mui";
import {
  formatDollarAmount,
  nanosecond2Millisecond,
  toSignificantWithGroupSeparator,
  formatTokenAmount,
  parseTokenAmount,
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

export interface LimitDetailsProps {
  open: boolean;
  position: Position;
  time: bigint;
  onClose: () => void;
  onCancelLimit: () => void;
}

export function LimitDetails({ open, position, time, onClose, onCancelLimit }: LimitDetailsProps) {
  const theme = useTheme();
  const principal = useAccountPrincipal();

  const {
    pool: { id: poolId, token0 },
  } = position;

  const { inputToken, outputToken, inputAmount, outputAmount, limitPrice, currentPrice } = useLimitDetails({
    position,
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
              {dayjs(nanosecond2Millisecond(time)).format("MM/DD/YYYY h:mm A")}
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
                <Trans>Limit Price</Trans>
              </Typography>
              <Tooltip tips={t`Limit price is the set price for buying or selling your token.`} />
            </Flex>

            <Typography sx={{ color: "text.primary", "@media(max-width: 640px)": { fontSize: "12px" } }}>
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

            <Typography sx={{ color: "text.primary", "@media(max-width: 640px)": { fontSize: "12px" } }}>
              {inputToken && outputToken && currentPrice
                ? `1 ${inputToken.symbol} = ${currentPrice.toSignificant()} ${outputToken.symbol}`
                : "--"}
            </Typography>
          </Flex>

          <Flex fullWidth justify="space-between" gap="0 12px">
            <Flex gap="0 4px" sx={{ "@media(max-width: 640px)": { maxWidth: "128px" } }}>
              <Typography
                sx={{
                  lineHeight: "14px",
                  "@media(max-width: 640px)": { fontSize: "12px", maxWidth: "112px" },
                }}
              >
                <Trans>Estimated trading fee earnings</Trans>
              </Typography>
              <Tooltip
                tips={t`When you place a limit order on ICPSwap, it's like adding a very narrow liquidity position. If your limit order is fully executed, you'll earn at least the minimum amount of transaction fees displayed.`}
              />
            </Flex>

            <Typography sx={{ color: "text.primary", "@media(max-width: 640px)": { fontSize: "12px" } }}>
              1 ICS = 0.00224234 ICP ($188,985)
            </Typography>
          </Flex>

          <Flex fullWidth justify="space-between" gap="0 12px">
            <Flex gap="0 4px" sx={{ "@media(max-width: 640px)": { maxWidth: "128px" } }}>
              <Typography
                sx={{
                  lineHeight: "14px",
                  "@media(max-width: 640px)": { fontSize: "12px", maxWidth: "112px" },
                }}
              >
                <Trans>Estimated transfer fee for limit order</Trans>
              </Typography>
              <Tooltip tips={t`Each order requires the transfer fee, determined by the token's canister.`} />
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
