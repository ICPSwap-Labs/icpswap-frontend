import { useMemo } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { CurrencySelector } from "components/swap/index";
import {
  formatDollarAmount,
  formatAmount,
  BigNumber,
  nonNullArgs,
  parseTokenAmount,
  formatTokenAmount,
} from "@icpswap/utils";
import { Flex, MaxButton, Tooltip } from "@icpswap/ui";
import { Token, CurrencyAmount } from "@icpswap/swap-sdk";
import { UseCurrencyState } from "hooks/useCurrency";
import { Trans, t } from "@lingui/macro";
import { TokenInfo } from "types/token";
import { SwapInput } from "components/swap/SwapInput";
import { impactColor } from "utils/swap/prices";
import { Null } from "@icpswap/types";

import { SwapBalances } from "./SwapBalances";
import { WalletIcon } from "./icons/WalletIcon";
import { CanisterIcon } from "./icons/CanisterIcon";

export interface SwapInputCurrencyProps {
  onMax?: () => void;
  onTokenChange: (token: TokenInfo) => void;
  currencyState: UseCurrencyState;
  currency: Token | undefined;
  currencyPrice: string | undefined | number;
  formattedAmount: string | undefined;
  onInput: (value: string) => void;
  currencyBalance: CurrencyAmount<Token> | undefined;
  parsedAmount: CurrencyAmount<Token> | undefined;
  usdChange?: string | null;
  background?: "level3" | "level1";
  disabled?: boolean;
  unusedBalance: bigint | Null;
  subBalance: BigNumber | Null;
  isInput?: boolean;
  onWalletBalanceClick?: () => void;
  onCanisterBalanceClick?: () => void;
  maxInputAmount?: CurrencyAmount<Token> | undefined;
  noLiquidity?: boolean;
}

export function SwapInputCurrency({
  onMax,
  currencyState,
  onTokenChange,
  currency,
  currencyPrice,
  formattedAmount,
  onInput,
  currencyBalance,
  parsedAmount,
  usdChange,
  background = "level3",
  disabled,
  unusedBalance,
  subBalance,
  isInput = false,
  onWalletBalanceClick,
  onCanisterBalanceClick,
  maxInputAmount,
  noLiquidity,
}: SwapInputCurrencyProps) {
  const theme = useTheme();

  const showMaxButton = Boolean(maxInputAmount?.greaterThan(0) && !parsedAmount?.equalTo(maxInputAmount));

  const currencyBalanceUSDValue = useMemo(() => {
    const amount = formattedAmount;
    if (!currencyPrice || !amount) return undefined;
    return new BigNumber(amount).multipliedBy(currencyPrice).toNumber();
  }, [currencyPrice, formattedAmount]);

  const impactTier = impactColor(usdChange);

  const USDChangeColor = !new BigNumber(usdChange ?? 0).isLessThan(0)
    ? "#54C081"
    : impactTier === 3
    ? "#D7331A"
    : impactTier === 2
    ? "#D3625B"
    : impactTier === 1
    ? "#F7B231"
    : "#8492c4";

  return (
    <Box
      sx={{
        backgroundColor: background === "level3" ? theme.palette.background.level3 : theme.palette.background.level1,
        border: `1px solid ${theme.palette.background.level4}`,
        borderRadius: "16px",
        padding: "16px",
        [theme.breakpoints.down("sm")]: {
          padding: "12px",
        },
      }}
    >
      <Box sx={{ display: "flex", gap: "0 8px" }}>
        <Flex align="center">
          <CurrencySelector
            currencyId={currency?.address}
            onChange={onTokenChange}
            disabledCurrency={currency ? [currency] : []}
            bgGray
            loading={currencyState === UseCurrencyState.LOADING}
          />
        </Flex>

        <Box sx={{ display: "flex", flex: 1, alignItems: "center" }}>
          <SwapInput value={formattedAmount ?? ""} currency={currency} onUserInput={onInput} disabled={disabled} />
        </Box>
      </Box>

      {currency ? (
        <Flex fullWidth justify="space-between" sx={{ margin: "12px 0 0 0" }}>
          <Flex gap="0 8px">
            {noLiquidity === false ? (
              nonNullArgs(unusedBalance) &&
              nonNullArgs(subBalance) &&
              currency &&
              parseTokenAmount(
                new BigNumber(unusedBalance.toString()).plus(subBalance),
                currency.decimals,
              ).isGreaterThan(0) ? (
                <Flex gap="0 3px" sx={{ cursor: "pointer" }} onClick={onCanisterBalanceClick}>
                  <CanisterIcon />

                  <Tooltip tips={t`Swap Pool Balances`}>
                    <Typography>
                      {formatAmount(
                        parseTokenAmount(
                          new BigNumber(unusedBalance.toString()).plus(subBalance),
                          currency.decimals,
                        ).toString(),
                        4,
                      )}
                    </Typography>
                  </Tooltip>
                </Flex>
              ) : null
            ) : null}

            <Flex gap="0 3px" sx={{ cursor: "pointer" }} onClick={onWalletBalanceClick}>
              <WalletIcon />

              <Tooltip tips={t`Wallet Balances`}>
                <Typography>{currencyBalance ? formatAmount(currencyBalance.toExact(), 4) : "--"}</Typography>
              </Tooltip>
            </Flex>

            {!!showMaxButton && !!onMax ? <MaxButton onClick={onMax} /> : null}
          </Flex>

          {currencyBalanceUSDValue ? (
            <Typography component="div">
              ~{formatDollarAmount(currencyBalanceUSDValue)}
              {usdChange ? (
                <Tooltip
                  tips={
                    <Typography
                      component="div"
                      sx={{
                        color: "#111936",
                        fontSize: "12px",
                        lineHeight: "18px",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#111936",
                          fontSize: "12px",
                          lineHeight: "18px",
                        }}
                      >
                        <Trans>Value difference = (Received value - Paid value) / Paid value</Trans>
                      </Typography>

                      <Typography
                        sx={{
                          color: "#111936",
                          fontSize: "12px",
                          lineHeight: "18px",
                        }}
                      >
                        <Trans>
                          When you trade a certain amount of tokens, it affects the liquidity pool's depth. This will
                          affect the overall availability and price of the tokens, leading to noticeable price
                          differences.
                        </Trans>
                      </Typography>
                    </Typography>
                  }
                >
                  <Typography
                    component="span"
                    sx={{ color: USDChangeColor, textDecoration: "underline", textDecorationStyle: "dashed" }}
                  >
                    ({usdChange}%)
                  </Typography>
                </Tooltip>
              ) : null}
            </Typography>
          ) : null}
        </Flex>
      ) : null}

      {currency && isInput ? (
        <Box sx={{ width: "50%", margin: "8px 0 0 0" }}>
          <SwapBalances
            amount={formattedAmount}
            token={currency}
            balance={formatTokenAmount(currencyBalance?.toExact(), currency.decimals).toString()}
            unusedBalance={unusedBalance}
            subAccountBalance={subBalance}
            maxSpentAmount={maxInputAmount?.toExact()}
            onAmountChange={onInput}
          />
        </Box>
      ) : null}
    </Box>
  );
}
