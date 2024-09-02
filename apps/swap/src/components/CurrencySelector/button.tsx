import { useCallback } from "react";
import { Grid, Typography, Box, Theme, makeStyles } from "components/Mui";
import { KeyboardArrowDown } from "@mui/icons-material";
import { isDarkTheme } from "utils";
import Loading from "components/Loading";
import { Trans } from "@lingui/macro";
import { Token } from "@icpswap/swap-sdk";
import { TokenImage } from "components/index";
import { Flex } from "@icpswap/ui";

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

export interface CurrencySelectorButtonProps {
  currency: undefined | null | Token;
  onClick?: () => void;
  bgGray?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export default function CurrencySelectorButton({
  currency,
  onClick,
  bgGray = false,
  loading,
  disabled,
}: CurrencySelectorButtonProps) {
  const classes = useStyle(bgGray)();

  const handleButtonClick = useCallback(() => {
    if (loading) return;
    if (onClick) onClick();
  }, [loading, onClick]);

  return currency ? (
    <Flex className={classes.selectButton} onClick={handleButtonClick}>
      <Flex gap="0 8px">
        <TokenImage logo={currency.logo} size="28px" tokenId={currency.address} />
        <Typography
          sx={{
            color: "text.primary",
            fontSize: "16px",
          }}
        >
          {currency.symbol}
        </Typography>
      </Flex>

      {!disabled && (
        <KeyboardArrowDown
          className={classes.arrow}
          sx={{
            fontSize: "1rem",
          }}
        />
      )}
      {loading && <Loading loading={loading} circularSize={20} />}
    </Flex>
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
