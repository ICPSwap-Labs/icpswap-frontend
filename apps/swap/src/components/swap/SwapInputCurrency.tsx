import { useMemo } from "react";
import { Grid, Box, Typography } from "@mui/material";
import CurrencySelector from "components/CurrencySelector";
import BigNumber from "bignumber.js";
import { formatDollarAmount } from "@icpswap/utils";
import { Token, CurrencyAmount } from "@icpswap/swap-sdk";
import { formatCurrencyAmount } from "utils/swap/formatCurrencyAmount";
import { UseCurrencyState } from "hooks/useCurrency";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { TokenInfo } from "types/token";
import { useMaxAmountSpend } from "hooks/swap/useMaxAmountSpend";
import { SwapInput } from "components/swap/SwapInput";
import { useTheme } from "@emotion/react";

export interface SwapInputCurrencyProps {
  onMax?: () => void;
  onTokenChange: (token: TokenInfo) => void;
  currencyState: UseCurrencyState;
  currency: Token | undefined;
  currencyPrice: string | undefined | number;
  formatAmount: string;
  onInput: (value: string) => void;
  currencyBalance: CurrencyAmount<Token> | undefined;
  parsedAmount: CurrencyAmount<Token> | undefined;
  tradePoolId: string | undefined;
  usdChange?: string | null;
  background?: "level3" | "level1";
  disabled?: boolean;
}

export function SwapInputCurrency({
  onMax,
  currencyState,
  onTokenChange,
  currency,
  currencyPrice,
  formatAmount,
  onInput,
  currencyBalance,
  parsedAmount,
  tradePoolId,
  usdChange,
  background = "level3",
  disabled,
}: SwapInputCurrencyProps) {
  const theme = useTheme() as Theme;

  const maxInputAmount = useMaxAmountSpend({
    currencyAmount: currencyBalance,
    poolId: tradePoolId,
  });

  const showMaxButton = Boolean(maxInputAmount?.greaterThan(0) && !parsedAmount?.equalTo(maxInputAmount));

  const currencyBalanceUSDValue = useMemo(() => {
    const amount = formatAmount;
    if (!currencyPrice || !amount) return undefined;
    return new BigNumber(amount).multipliedBy(currencyPrice).toNumber();
  }, [currencyPrice, formatAmount]);

  const USDChangeColor = !new BigNumber(usdChange ?? 0).isLessThan(0) ? "#54C081" : "#D3625B";

  return (
    <Box
      sx={{
        backgroundColor: background === "level3" ? theme.palette.background.level3 : theme.palette.background.level1,
        border: `1px solid ${theme.palette.background.level4}`,
        borderRadius: "16px",
        padding: "14px 10px",
        [theme.breakpoints.down("sm")]: {
          padding: "12px 8px",
        },
      }}
    >
      <Box sx={{ display: "flex", gap: "0 8px" }}>
        <Box>
          <CurrencySelector
            currencyId={currency?.address}
            onChange={onTokenChange}
            disabledCurrency={currency ? [currency] : []}
            bgGray
            loading={currencyState === UseCurrencyState.LOADING}
          />
        </Box>

        <Box sx={{ display: "flex", flex: 1, alignItems: "center" }}>
          <SwapInput value={formatAmount} currency={currency} onUserInput={onInput} disabled={disabled} />
        </Box>
      </Box>

      {currency ? (
        <Grid container alignItems="center" mt="12px">
          <Typography>
            <Trans>Balance: {currencyBalance ? formatCurrencyAmount(currencyBalance, currency.decimals) : "--"}</Trans>
          </Typography>

          {!!showMaxButton && !!onMax ? (
            <Typography
              fontSize="12px"
              sx={{
                padding: "1px 3px",
                cursor: "pointer",
                borderRadius: "2px",
                backgroundColor: theme.colors.secondaryMain,
                color: "#ffffff",
                marginLeft: "4px",
              }}
              onClick={onMax}
            >
              <Trans>MAX</Trans>
            </Typography>
          ) : null}

          {currencyBalanceUSDValue ? (
            <Grid item xs>
              <Grid container alignItems="center" justifyContent="flex-end">
                <Typography>
                  ~{formatDollarAmount(currencyBalanceUSDValue)}
                  {usdChange ? (
                    <Typography component="span" sx={{ color: USDChangeColor }}>
                      ({usdChange}%)
                    </Typography>
                  ) : null}
                </Typography>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      ) : null}
    </Box>
  );
}
