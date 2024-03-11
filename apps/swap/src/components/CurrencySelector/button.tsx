import { useCallback } from "react";
import { Grid, Avatar, Typography, Box } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { KeyboardArrowDown } from "@mui/icons-material";
import { isDarkTheme } from "utils";
import Loading from "components/Loading";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { TokenInfo } from "types/token";
import { Token } from "@icpswap/swap-sdk";

const useStyle = (bgGray: boolean) =>
  makeStyles((theme: Theme) => {
    return {
      selectButton: {
        position: "relative",
        padding: "0 16px 0 12px",
        height: "44px",
        color: "#ffffff",
        cursor: "pointer",
        backgroundColor: isDarkTheme(theme)
          ? theme.palette.background.level2
          : bgGray
          ? theme.colors.lightGray200
          : "#ffffff",
        borderRadius: `${theme.radius}px`,
      },
      selectButtonActive: {
        padding: "0 16px",
        height: "44px",
        lineHeight: "44px",
        background: theme.themeOption.defaultGradient,
        color: "#ffffff",
        cursor: "pointer",
        borderRadius: `${theme.radius}px`,
      },
      arrow: {
        color: isDarkTheme(theme) ? "inherit" : "#757575",
        "&.active": {
          color: "#fff",
        },
      },
    };
  });

export default function CurrencySelectorButton({
  currency,
  onClick,
  bgGray = false,
  loading,
  disabled,
}: {
  currency: TokenInfo | undefined | null | Token;
  onClick?: () => void;
  bgGray?: boolean;
  loading?: boolean;
  disabled?: boolean;
}) {
  const classes = useStyle(bgGray)();
  const theme = useTheme() as Theme;

  const handleButtonClick = useCallback(() => {
    if (loading) return;
    onClick && onClick();
  }, [loading, onClick]);

  return currency ? (
    <Grid container className={classes.selectButton} alignItems="center" onClick={handleButtonClick}>
      <Grid item mr={1} xs>
        <Grid container alignItems="center">
          <Avatar
            sx={{
              ...theme.palette.avatar.gray200BgColor,
              display: "inline-block",
              marginRight: "8px",
              width: "28px",
              height: "28px",
            }}
            alt=""
            src={currency?.logo}
          >
            &nbsp;
          </Avatar>
          <Typography component="span">{currency.symbol}</Typography>
        </Grid>
      </Grid>
      {!disabled && (
        <KeyboardArrowDown
          className={classes.arrow}
          sx={{
            fontSize: "1rem",
          }}
        />
      )}
      {loading && <Loading loading={loading} circularSize={20} />}
    </Grid>
  ) : (
    <Box className={classes.selectButtonActive} onClick={handleButtonClick}>
      <Grid container alignItems="center">
        <Grid container alignItems="center" item xs>
          <Trans>Select a token</Trans>
        </Grid>
        <KeyboardArrowDown
          className={`${classes.arrow} active`}
          sx={{
            fontSize: "1rem",
          }}
        />
      </Grid>
    </Box>
  );
}
