import { Box, Grid, Typography, Chip, Avatar } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { CurrencyAmount, Token } from "@icpswap/swap-sdk";
import LockIcon from "assets/images/swap/Lock";
import { NumberTextField } from "components/index";
import { SAFE_DECIMALS_LENGTH, MAX_SWAP_INPUT_LENGTH } from "constants/index";
import { formatCurrencyAmount } from "utils/swap/formatCurrencyAmount";
import { isDarkTheme } from "utils";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";

const useStyle = makeStyles((theme: Theme) => {
  return {
    box: {
      position: "relative",
      borderRadius: `${theme.radius}px`,
      backgroundColor: theme.palette.background.level3,
      border: theme.palette.border.gray200,
    },
    input: {
      "& input": {
        textAlign: "right",
        fontSize: "20px",
        fontWeight: 700,
        // color: theme.textPrimary,
        [theme.breakpoints.down("sm")]: {
          fontSize: "16px",
        },
      },
      "& input::placeholder": {
        fontSize: "20px",
        fontWeight: 700,
        [theme.breakpoints.down("sm")]: {
          fontSize: "16px",
        },
      },
    },
    chip: {
      padding: "0 10px",
      height: "44px",
      backgroundColor: isDarkTheme(theme) ? theme.palette.background.level2 : theme.colors.lightGray200,
      borderRadius: `${theme.radius}px`,
      "& .MuiChip-label": {
        paddingLeft: "18px",
      },
    },
    maxButton: {
      padding: "1px 3px",
      cursor: "pointer",
      borderRadius: "2px",
      backgroundColor: theme.colors.secondaryMain,
      color: "#ffffff",
    },
  };
});

const LockMask = ({ type }: { type: string | undefined }) => {
  const theme = useTheme() as Theme;

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
}

export default function SwapDepositAmount({
  currency,
  value,
  locked = false,
  onUserInput,
  type,
  currencyBalance,
  showMaxButton,
  onMax,
}: SwapDepositAmountProps) {
  const classes = useStyle();
  const theme = useTheme() as Theme;

  const decimals = currency?.decimals ?? SAFE_DECIMALS_LENGTH;

  return (
    <Box sx={{ p: 2 }} className={classes.box}>
      <Grid container alignItems="center">
        <Chip
          className={classes.chip}
          label={currency?.symbol}
          avatar={
            <Avatar sx={{ ...theme.palette.avatar.gray200BgColor }} src={currency?.logo}>
              &nbsp;
            </Avatar>
          }
        />
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
      <Grid container mt={1}>
        <Grid item mr={1}>
          <Typography>
            <Trans>Balance:</Trans> {formatCurrencyAmount(currencyBalance, currency?.decimals ?? 8)}
          </Typography>
        </Grid>
        {showMaxButton && (
          <Grid>
            <Typography fontSize={12} className={classes.maxButton} onClick={onMax}>
              <Trans>Max</Trans>
            </Typography>
          </Grid>
        )}
      </Grid>
      {locked && <LockMask type={type} />}
    </Box>
  );
}
