import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { Flex, TextButton } from "@icpswap/ui";
import { type BigNumber, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { ReactComponent as CopyIcon } from "assets/icons/Copy.svg";
import Copy, { type CopyRef } from "components/Copy";
import { Box, Button, CircularProgress, Typography, useTheme } from "components/Mui";
import QRCode from "components/qrcode";
import { useOisyDisabledTips } from "hooks/useOisyDisabledTips";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

interface BitcoinStyleMintUIProps {
  token: Token;
  balance: BigNumber | string | Null;
  address: string | Null;
  onRefreshBalance: () => void;
  refreshLoading: boolean;
  explorerLink: string;
  explorerSymbol: string;
}

export function BitcoinStyleMintUI({
  token,
  balance,
  address,
  onRefreshBalance,
  refreshLoading,
  explorerLink,
  explorerSymbol,
}: BitcoinStyleMintUIProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const copyRef = useRef<CopyRef>(null);

  const handleCopy = () => {
    if (copyRef) {
      copyRef?.current?.copy();
    }
  };

  useOisyDisabledTips({ page: "ck-bridge" });

  const symbol = token.symbol.replace("ck", "");

  return (
    <>
      <Box
        sx={{
          width: "100%",
          padding: "20px 16px",
          background: theme.palette.background.level2,
          borderRadius: "16px",
        }}
      >
        <Box>
          <Typography align="center">{t("common.balance")}</Typography>

          <Flex gap="0 4px" sx={{ margin: "8px 0 0 0" }} justify="center">
            <Typography
              sx={{
                color: "text.primary",
                fontWeight: 600,
                fontSize: "20px",
              }}
            >
              {balance ? toSignificantWithGroupSeparator(parseTokenAmount(balance, token.decimals).toString()) : "--"}
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
              }}
            >
              {token.symbol}
            </Typography>
          </Flex>
        </Box>

        <Flex
          sx={{
            margin: "24px 0 0 0",
            width: "100%",
            padding: "20px 16px",
            background: theme.palette.background.level2,
            borderRadius: "16px",
            border: `1px solid ${theme.palette.background.level4}`,
            "@media(max-width: 640px)": {
              flexDirection: "column",
              gap: "16px 0",
              alignItems: "center",
            },
          }}
          justify="space-between"
          align="flex-start"
        >
          <Box>
            <Box>
              <Typography>{t("bridge.deposit.address", { symbol })}</Typography>
              <Typography
                component="div"
                sx={{
                  color: "text.primary",
                  maxWidth: "380px",
                  lineHeight: "20px",
                  margin: "8px 0 0 0",
                  wordBreak: "break-all",
                  cursor: "pointer",
                }}
                onClick={handleCopy}
              >
                {address ?? "--"}

                {address ? (
                  <Box component="span" sx={{ margin: "0 0 0 4px", cursor: "pointer" }}>
                    <CopyIcon />
                  </Box>
                ) : null}
              </Typography>

              <TextButton sx={{ fontSize: "12px" }} link={explorerLink}>
                {t("bridge.check.explorer", { symbol: explorerSymbol })}
              </TextButton>
            </Box>

            <Box
              sx={{
                margin: "46px 0 0 0",
                "@media(max-width: 640px)": {
                  margin: "20px 0 0 0",
                },
              }}
            >
              <Button
                variant="outlined"
                onClick={onRefreshBalance}
                startIcon={refreshLoading ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {t("bridge.check.incoming", { symbol })}
              </Button>
            </Box>
          </Box>

          {address ? (
            <Box
              sx={{
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                borderRadius: "8px",
                background: "#ffffff",
              }}
            >
              <QRCode width={120} height={120} value={address} />
            </Box>
          ) : null}
        </Flex>
      </Box>

      <Copy content={address ?? ""} hide ref={copyRef} />
    </>
  );
}
