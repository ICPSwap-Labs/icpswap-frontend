import { useMemo, useCallback } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { CurrencySelector } from "components/swap/index";
import {
  formatDollarAmount,
  BigNumber,
  nonNullArgs,
  parseTokenAmount,
  formatTokenAmount,
  isNullArgs,
} from "@icpswap/utils";
import { Flex, MaxButton, Tooltip } from "@icpswap/ui";
import { Token, CurrencyAmount } from "@icpswap/swap-sdk";
import { UseCurrencyState } from "hooks/useCurrency";
import { Trans } from "@lingui/macro";
import { SwapInput } from "components/swap/SwapInput";
import { impactColor } from "utils/swap/prices";
import { Null } from "@icpswap/types";
import { useBalanceMaxSpend, usePoolBalanceMaxSpend } from "hooks/swap";
import { maxAmountFormat } from "utils/index";

import { SwapBalancesSlider } from "./SwapBalancesSlider";
import { SwapPoolBalance } from "./SwapPoolBalance";
import { WalletBalance } from "./WalletBalance";

export interface SwapInputCurrencyProps {
  onMax?: () => void;
  onTokenChange: (token: Token) => void;
  currencyState: UseCurrencyState;
  token: Token | undefined;
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
  maxInputAmount?: CurrencyAmount<Token> | undefined;
  noLiquidity?: boolean;
  poolId: string | Null;
  showUSDChange?: boolean;
}

export function SwapInputCurrency({
  onMax,
  currencyState,
  onTokenChange,
  token,
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
  maxInputAmount,
  noLiquidity,
  poolId,
  showUSDChange = true,
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

  const maxWalletBalanceSpent = useBalanceMaxSpend({
    token,
    balance: formatTokenAmount(currencyBalance?.toExact(), token?.decimals).toString(),
    poolId,
  });
  const maxPoolBalanceSpent = usePoolBalanceMaxSpend({ token, subBalance, unusedBalance });

  const handleWalletBalanceClick = useCallback(() => {
    if (!isInput || isNullArgs(maxWalletBalanceSpent) || isNullArgs(token)) return;
    onInput(maxAmountFormat(maxWalletBalanceSpent.toExact(), token.decimals));
  }, [onInput, isInput, maxWalletBalanceSpent, token]);

  const handleCanisterBalanceClick = useCallback(() => {
    if (isInput !== true || isNullArgs(maxPoolBalanceSpent) || isNullArgs(token)) return undefined;
    onInput(maxAmountFormat(maxPoolBalanceSpent.toExact(), token.decimals));
  }, [onInput, maxPoolBalanceSpent, isInput, token]);

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
            currencyId={token?.address}
            onChange={onTokenChange}
            disabledCurrency={token ? [token] : []}
            bgGray
            loading={currencyState === UseCurrencyState.LOADING}
          />
        </Flex>

        <Box sx={{ display: "flex", flex: 1, alignItems: "center" }}>
          <SwapInput value={formattedAmount} token={token} onUserInput={onInput} disabled={disabled} />
        </Box>
      </Box>

      {token ? (
        <Flex fullWidth justify="space-between" sx={{ margin: "12px 0 0 0" }}>
          <Flex gap="0 8px">
            {noLiquidity === false ? (
              nonNullArgs(unusedBalance) &&
              nonNullArgs(subBalance) &&
              token &&
              parseTokenAmount(new BigNumber(unusedBalance.toString()).plus(subBalance), token.decimals).isGreaterThan(
                0,
              ) ? (
                <SwapPoolBalance
                  onClick={handleCanisterBalanceClick}
                  subAccountBalance={subBalance}
                  unusedBalance={unusedBalance}
                  token={token}
                />
              ) : null
            ) : null}

            <WalletBalance currencyBalance={currencyBalance} onClick={handleWalletBalanceClick} />

            {!!showMaxButton && !!onMax ? <MaxButton onClick={onMax} /> : null}
          </Flex>

          {currencyBalanceUSDValue && showUSDChange ? (
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
                    sx={{
                      color: USDChangeColor,
                      textDecoration: "underline",
                      textDecorationStyle: "dashed",
                      cursor: "pointer",
                    }}
                  >
                    ({usdChange}%)
                  </Typography>
                </Tooltip>
              ) : null}
            </Typography>
          ) : null}
        </Flex>
      ) : null}

      {token && isInput ? (
        <Box sx={{ width: "40%", margin: "8px 0 0 0" }}>
          <SwapBalancesSlider
            amount={formattedAmount}
            token={token}
            balance={formatTokenAmount(currencyBalance?.toExact(), token.decimals).toString()}
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
