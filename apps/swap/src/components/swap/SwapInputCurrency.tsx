import { useSetTimeoutCall } from "@icpswap/hooks";
import type { CurrencyAmount, Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { Flex, Tooltip } from "@icpswap/ui";
import {
  BigNumber,
  formatDollarAmount,
  formatTokenAmount,
  isUndefinedOrNull,
  nonUndefinedOrNull,
  parseTokenAmount,
} from "@icpswap/utils";
import { Box, Typography, useTheme } from "components/Mui";
import { TokenBalanceSlider } from "components/Slider/index";
import { CurrencySelector } from "components/swap/index";
import { SwapInput } from "components/swap/SwapInput";
import { SwapPoolBalance } from "components/swap/SwapPoolBalance";
import { WalletBalance } from "components/swap/WalletBalance";
import { useBalanceMaxSpend, usePoolBalanceMaxSpend } from "hooks/swap";
import { UseCurrencyState } from "hooks/useCurrency";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { maxAmountFormat } from "utils/index";
import { impactColor } from "utils/swap/prices";

const LOADING_TRANSFORM_DURATION = 100;

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
  subBalance: string | Null;
  isInput?: boolean;
  maxInputAmount?: CurrencyAmount<Token> | undefined;
  noLiquidity?: boolean;
  poolId: string | Null;
  showUSDChange?: boolean;
}

export function SwapInputCurrency({
  currencyState,
  onTokenChange,
  token,
  currencyPrice,
  formattedAmount,
  onInput,
  currencyBalance,
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
  const { t } = useTranslation();
  const theme = useTheme();
  const [transformLoading, setTransformLoading] = useState(false);

  // const showMaxButton = Boolean(maxInputAmount?.greaterThan(0) && !parsedAmount?.equalTo(maxInputAmount));

  const currencyBalanceUSDValue = useMemo(() => {
    const amount = formattedAmount;
    if (!currencyPrice || !amount) return undefined;
    return new BigNumber(amount).multipliedBy(currencyPrice).toNumber();
  }, [currencyPrice, formattedAmount]);

  const impactTier = impactColor(usdChange);

  const USDChangeColor = !new BigNumber(usdChange ?? 0).isLessThan(0)
    ? "var(--color-success)"
    : impactTier === 3
      ? "var(--color-error)"
      : impactTier === 2
        ? "var(--color-error)"
        : impactTier === 1
          ? "var(--color-warning)"
          : "var(--color-neutral-content)";

  const maxWalletBalanceSpent = useBalanceMaxSpend({
    token,
    balance: formatTokenAmount(currencyBalance?.toExact(), token?.decimals).toString(),
    poolId,
  });
  const maxPoolBalanceSpent = usePoolBalanceMaxSpend({ token, subBalance, unusedBalance });

  const handleWrappedInput = useCallback(
    (value: string) => {
      onInput(value);
    },
    [onInput],
  );

  const handleWalletBalanceClick = useCallback(() => {
    if (!isInput || isUndefinedOrNull(maxWalletBalanceSpent) || isUndefinedOrNull(token)) return;
    handleWrappedInput(maxAmountFormat(maxWalletBalanceSpent.toExact(), token.decimals));
  }, [handleWrappedInput, isInput, maxWalletBalanceSpent, token]);

  const handleCanisterBalanceClick = useCallback(() => {
    if (isInput !== true || isUndefinedOrNull(maxPoolBalanceSpent) || isUndefinedOrNull(token)) return undefined;
    handleWrappedInput(maxAmountFormat(maxPoolBalanceSpent.toExact(), token.decimals));
  }, [handleWrappedInput, maxPoolBalanceSpent, isInput, token]);

  const clearTransformLoading = useSetTimeoutCall(
    useCallback(() => {
      setTransformLoading(false);
    }, []),
    LOADING_TRANSFORM_DURATION,
  );

  const handleWrapperClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      setTransformLoading(true);

      clearTransformLoading();
    },
    [clearTransformLoading],
  );

  return (
    <Box
      className="swap-token-panel border border-base-300 bg-base-100"
      data-surface={background}
      sx={{
        "--swap-ticket-surface": theme.palette.background[background],
        "--swap-ticket-outline": theme.palette.background.level4,
        transform: transformLoading ? "scale(0.9887)" : "scale(1)",
        opacity: transformLoading ? 0.9 : 1,
      }}
      onClick={handleWrapperClick}
    >
      <Box className="swap-token-main">
        <Flex className="swap-token-selector" align="center">
          <CurrencySelector
            currencyId={token?.address}
            onChange={onTokenChange}
            disabledCurrency={token ? [token] : []}
            bgGray
            loading={currencyState === UseCurrencyState.LOADING}
          />
        </Flex>

        <Box className="swap-amount-field" sx={{ display: "flex", flex: 1, minWidth: 0, alignItems: "center" }}>
          <SwapInput value={formattedAmount} token={token} onUserInput={handleWrappedInput} disabled={disabled} />
        </Box>
      </Box>

      {token ? (
        <Flex
          className="swap-token-balances"
          fullWidth
          justify="space-between"
          sx={{ margin: "20px 0 0 0", minHeight: "18px", gap: "8px", flexWrap: "wrap" }}
        >
          <Flex gap="0 8px">
            {noLiquidity === false ? (
              nonUndefinedOrNull(unusedBalance) &&
              nonUndefinedOrNull(subBalance) &&
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

            {/* {!!showMaxButton && !!onMax ? <MaxButton onClick={onMax} /> : null} */}
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
                        {t("swap.value.difference")}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#111936",
                          fontSize: "12px",
                          lineHeight: "18px",
                        }}
                      >
                        {t("swap.value.difference.descriptions")}
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
        <Box className="swap-balance-slider" sx={{ width: "100%", margin: "12px 0 0 0" }}>
          <TokenBalanceSlider
            value={formattedAmount}
            totalAmount={maxInputAmount?.toExact()}
            token={token}
            onAmountChange={onInput}
          />
        </Box>
      ) : null}
    </Box>
  );
}
