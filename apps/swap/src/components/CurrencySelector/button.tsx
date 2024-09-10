import { useCallback } from "react";
import { Typography, Box, Theme, makeStyles, useTheme } from "components/Mui";
import { isDarkTheme } from "utils";
import { Trans } from "@lingui/macro";
import { Token } from "@icpswap/swap-sdk";
import { TokenImage, Loading } from "components/index";
import { Flex } from "@icpswap/ui";
import { ChevronDown } from "react-feather";

const useStyle = (bgGray: boolean) =>
  makeStyles((theme: Theme) => {
    return {
      selectButton: {
        padding: "8px",
        cursor: "pointer",
        backgroundColor: isDarkTheme(theme)
          ? theme.palette.background.level2
          : bgGray
          ? theme.colors.lightGray200
          : "#ffffff",
        borderRadius: "12px",
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

export function CurrencySelectorButton({ currency, onClick, bgGray = false, loading }: CurrencySelectorButtonProps) {
  const theme = useTheme();
  const classes = useStyle(bgGray)();

  const handleButtonClick = useCallback(() => {
    if (loading) return;
    if (onClick) onClick();
  }, [loading, onClick]);

  return currency ? (
    <Flex
      sx={{
        padding: "8px",
        cursor: "pointer",
        backgroundColor: isDarkTheme(theme)
          ? theme.palette.background.level2
          : bgGray
          ? theme.colors.lightGray200
          : "#ffffff",
        borderRadius: "12px",
      }}
      onClick={handleButtonClick}
      gap="0 8px"
      justify="space-between"
    >
      <Flex gap="0 8px">
        <TokenImage logo={currency.logo} size="24px" tokenId={currency.address} />

        <Typography
          sx={{
            color: "text.primary",
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          {currency.symbol}
        </Typography>
      </Flex>

      <ChevronDown size={14} color={theme.colors.darkTextSecondary} />

      {loading && <Loading loading={loading} circularSize={20} />}
    </Flex>
  ) : (
    <Box className={classes.selectButtonActive} onClick={handleButtonClick}>
      <Flex gap="0 8px">
        <Typography color="text.primary">
          <Trans>Select a token</Trans>
        </Typography>

        <ChevronDown size={14} color={theme.colors.darkTextSecondary} />
      </Flex>
    </Box>
  );
}
