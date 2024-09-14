import { useCallback } from "react";
import { makeStyles, useTheme, Box, Grid, Typography, Theme } from "components/Mui";
import { CurrencyAmount, Token } from "@icpswap/swap-sdk";
import LockIcon from "assets/images/swap/Lock";
import { NumberTextField, TokenImage, MaxButton } from "components/index";
import { SAFE_DECIMALS_LENGTH, MAX_SWAP_INPUT_LENGTH } from "constants/index";
import { isDarkTheme } from "utils";
import { nonNullArgs, formatAmount, parseTokenAmount, BigNumber, formatTokenAmount } from "@icpswap/utils";
import { Trans, t } from "@lingui/macro";
import { Flex, Tooltip } from "@icpswap/ui";
import { SwapBalances } from "components/swap/SwapBalances";
import { Null } from "@icpswap/types";

import { WalletIcon } from "./icons/WalletIcon";
import { CanisterIcon } from "./icons/CanisterIcon";

const useStyle = makeStyles((theme: Theme) => {
  return {
    box: {
      position: "relative",
      width: "100%",
      borderRadius: `${theme.radius}px`,
      backgroundColor: theme.palette.background.level3,
      border: theme.palette.border.gray200,
    },
    input: {
      "& input": {
        textAlign: "right",
        fontSize: "28px!important",
        fontWeight: 600,
        padding: "0px",
        [theme.breakpoints.down("sm")]: {
          fontSize: "16px",
        },
      },
      "& input::placeholder": {
        fontSize: "28px",
        fontWeight: 600,
        [theme.breakpoints.down("sm")]: {
          fontSize: "16px",
        },
      },
    },
    chip: {
      padding: "0 10px",
      height: "40px",
      backgroundColor: isDarkTheme(theme) ? theme.palette.background.level2 : theme.colors.lightGray200,
      borderRadius: `12px`,
      "& .MuiChip-label": {
        paddingLeft: "18px",
      },
    },
  };
});

interface LockMaskProps {
  type: string | undefined;
}

const LockMask = ({ type }: LockMaskProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          background: type === "addLiquidity" ? theme.palette.background.level2 : theme.palette.background.level1,
          opacity: 0.9,
          borderRadius: "12px",
        }}
      />
      <Grid
        container
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        justifyContent="center"
        alignItems="center"
      >
        <LockIcon />
        <Typography align="center" color="textPrimary">
          <Trans>The market price is outside your specified price range. Single-asset deposit only.</Trans>
        </Typography>
      </Grid>
    </Box>
  );
};

export interface SwapDepositAmountProps {
  currency: Token | undefined;
  type?: string;
  value: string | number;
  locked?: boolean;
  onUserInput: (value: string) => void;
  showMaxButton?: boolean;
  onMax?: () => void;
  currencyBalance: CurrencyAmount<Token> | undefined;
  subAccountBalance: BigNumber | Null;
  unusedBalance: bigint | Null;
  maxSpentAmount: string | Null;
  noLiquidity?: boolean;
}

export function SwapDepositAmount({
  currency,
  value,
  locked = false,
  onUserInput,
  type,
  currencyBalance,
  showMaxButton,
  onMax,
  subAccountBalance,
  unusedBalance,
  maxSpentAmount,
  noLiquidity,
}: SwapDepositAmountProps) {
  const classes = useStyle();

  const decimals = currency?.decimals ?? SAFE_DECIMALS_LENGTH;

  const handleCanisterBalanceClick = useCallback(() => {
    if (!subAccountBalance || !unusedBalance || !currency) return;

    if (subAccountBalance.isEqualTo(0)) {
      onUserInput(parseTokenAmount(unusedBalance, currency.decimals).toString());
    } else {
      onUserInput(
        parseTokenAmount(unusedBalance, currency.decimals)
          .plus(parseTokenAmount(subAccountBalance.minus(currency.transFee), currency.decimals))
          .toString(),
      );
    }
  }, [subAccountBalance, unusedBalance, currency]);

  const handleWalletBalanceClick = useCallback(() => {
    if (!currencyBalance) return;
    onUserInput(currencyBalance.toExact());
  }, [currencyBalance]);

  return (
    <Box sx={{ p: 2 }} className={classes.box}>
      <Grid container alignItems="center">
        <Flex gap="0 8px" className={classes.chip}>
          <TokenImage logo={currency?.logo} tokenId={currency?.wrapped.address} size="24px" />
          <Typography
            sx={{
              color: "text.primary",
              fontSize: "16px",
            }}
          >
            {currency?.symbol}
          </Typography>
        </Flex>

        <Grid item xs>
          <NumberTextField
            value={value}
            fullWidth
            className={classes.input}
            placeholder="0.0"
            variant="standard"
            numericProps={{
              thousandSeparator: true,
              decimalScale: decimals > SAFE_DECIMALS_LENGTH ? SAFE_DECIMALS_LENGTH : decimals,
              allowNegative: false,
              maxLength: MAX_SWAP_INPUT_LENGTH,
            }}
            onChange={(e) => {
              onUserInput(e.target.value);
            }}
          />
        </Grid>
      </Grid>

      <Flex gap="0 4px" sx={{ margin: "12px 0 0 0" }}>
        {currency ? (
          <Flex fullWidth justify="space-between">
            <Flex gap="0 8px">
              {noLiquidity === false ? (
                nonNullArgs(unusedBalance) &&
                nonNullArgs(subAccountBalance) &&
                currency &&
                parseTokenAmount(
                  new BigNumber(unusedBalance.toString()).plus(subAccountBalance),
                  currency.decimals,
                ).isGreaterThan(0) ? (
                  <Flex gap="0 3px" sx={{ cursor: "pointer" }} onClick={handleCanisterBalanceClick}>
                    <CanisterIcon />

                    <Tooltip tips={t`Swap Pool Balances`}>
                      <Typography>
                        {formatAmount(
                          parseTokenAmount(
                            new BigNumber(unusedBalance.toString()).plus(subAccountBalance),
                            currency.decimals,
                          ).toString(),
                          4,
                        )}
                      </Typography>
                    </Tooltip>
                  </Flex>
                ) : null
              ) : null}

              <Flex gap="0 3px" sx={{ cursor: "pointer" }} onClick={handleWalletBalanceClick}>
                <WalletIcon />

                <Tooltip tips={t`Wallet Balances`}>
                  <Typography>{currencyBalance ? formatAmount(currencyBalance.toExact(), 4) : "--"}</Typography>
                </Tooltip>
              </Flex>

              {!!showMaxButton && !!onMax ? <MaxButton onClick={onMax} /> : null}
            </Flex>
          </Flex>
        ) : null}
      </Flex>

      {currency ? (
        <Box sx={{ margin: "8px 0 0 0", width: "50%" }}>
          <SwapBalances
            token={currency}
            unusedBalance={unusedBalance}
            subAccountBalance={subAccountBalance}
            balance={
              currencyBalance && currency
                ? formatTokenAmount(currencyBalance.toExact(), currency.decimals).toString()
                : undefined
            }
            onAmountChange={onUserInput}
            amount={value}
            maxSpentAmount={maxSpentAmount}
          />
        </Box>
      ) : null}

      {locked && <LockMask type={type} />}
    </Box>
  );
}
