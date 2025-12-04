import { useCallback } from "react";
import { makeStyles, useTheme, Box, Grid, Typography, Theme } from "components/Mui";
import { CurrencyAmount, Token } from "@icpswap/swap-sdk";
import LockIcon from "assets/images/swap/Lock";
import { NumberTextField, TokenImage } from "components/index";
import { SAFE_DECIMALS_LENGTH, MAX_SWAP_INPUT_LENGTH } from "constants/index";
import { isDarkTheme } from "utils";
import { nonUndefinedOrNull, parseTokenAmount, BigNumber, formatTokenAmount, isUndefinedOrNull } from "@icpswap/utils";
import { Flex } from "@icpswap/ui";
// import { TokenBalanceSlider } from "components/Slider/index";
import { Null } from "@icpswap/types";
import { WalletBalance } from "components/swap/WalletBalance";
import { SwapPoolBalance } from "components/swap/SwapPoolBalance";
import { useTranslation } from "react-i18next";
import { useBalanceMaxSpend } from "hooks";
import { maxAmountFormat } from "utils/index";
import { tokenSymbolEllipsis } from "utils/tokenSymbolEllipsis";

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
  const { t } = useTranslation();
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
          {t("swap.single.deposit.descriptions")}
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
  subAccountBalance: string | Null;
  unusedBalance: bigint | Null;
  maxSpentAmount: string | Null;
  noLiquidity?: boolean;
  poolId: string | Null;
}

export function SwapDepositAmount({
  currency,
  value,
  locked = false,
  onUserInput,
  type,
  currencyBalance,
  subAccountBalance,
  unusedBalance,
  noLiquidity,
  poolId,
}: SwapDepositAmountProps) {
  const classes = useStyle();

  const decimals = currency?.decimals ?? SAFE_DECIMALS_LENGTH;

  const handleCanisterBalanceClick = useCallback(() => {
    if (!subAccountBalance || !unusedBalance || !currency) return;

    if (new BigNumber(subAccountBalance).isEqualTo(0)) {
      onUserInput(parseTokenAmount(unusedBalance, currency.decimals).toString());
    } else {
      onUserInput(
        parseTokenAmount(unusedBalance, currency.decimals)
          .plus(parseTokenAmount(new BigNumber(subAccountBalance).minus(currency.transFee), currency.decimals))
          .toString(),
      );
    }
  }, [subAccountBalance, unusedBalance, currency]);

  const maxWalletBalanceSpent = useBalanceMaxSpend({
    token: currency,
    balance: formatTokenAmount(currencyBalance?.toExact(), currency?.decimals).toString(),
    poolId,
  });

  const handleWalletBalanceClick = useCallback(() => {
    if (isUndefinedOrNull(maxWalletBalanceSpent) || isUndefinedOrNull(currency)) return;
    onUserInput(maxAmountFormat(maxWalletBalanceSpent.toExact(), currency.decimals));
  }, [onUserInput, maxWalletBalanceSpent, currency]);

  return (
    <Box sx={{ p: 2 }} className={classes.box}>
      <Flex fullWidth gap="0 8px">
        <Flex gap="0 8px" className={classes.chip}>
          <TokenImage logo={currency?.logo} tokenId={currency?.wrapped.address} size="24px" />
          <Typography
            sx={{
              color: "text.primary",
              fontSize: "16px",
            }}
          >
            {tokenSymbolEllipsis({ symbol: currency?.symbol })}
          </Typography>
        </Flex>

        <Box sx={{ flex: 1 }}>
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
        </Box>
      </Flex>

      <Flex gap="0 4px" sx={{ margin: "12px 0 0 0" }}>
        {currency ? (
          <Flex fullWidth justify="space-between">
            <Flex gap="0 8px">
              {noLiquidity === false ? (
                nonUndefinedOrNull(unusedBalance) &&
                nonUndefinedOrNull(subAccountBalance) &&
                currency &&
                parseTokenAmount(
                  new BigNumber(unusedBalance.toString()).plus(subAccountBalance),
                  currency.decimals,
                ).isGreaterThan(0) ? (
                  <SwapPoolBalance
                    onClick={handleCanisterBalanceClick}
                    token={currency}
                    subAccountBalance={subAccountBalance}
                    unusedBalance={unusedBalance}
                  />
                ) : null
              ) : null}

              <WalletBalance onClick={handleWalletBalanceClick} currencyBalance={currencyBalance} />
            </Flex>
          </Flex>
        ) : null}
      </Flex>

      {/* {currency ? (
        <Box sx={{ margin: "8px 0 0 0", width: "50%" }}>
          <TokenBalanceSlider
            value={value.toString()}
            token={currency}
            totalAmount={maxSpentAmount}
            onAmountChange={onUserInput}
          />
        </Box>
      ) : null} */}

      {locked && <LockMask type={type} />}
    </Box>
  );
}
