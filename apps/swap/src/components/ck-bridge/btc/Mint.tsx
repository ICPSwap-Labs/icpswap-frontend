import { Token } from "@icpswap/swap-sdk";
import { parseTokenAmount, toSignificantWithGroupSeparator, BigNumber } from "@icpswap/utils";
import { useTheme, Box, Typography, Button, CircularProgress } from "components/Mui";
import { useRef, useState, useCallback, useEffect } from "react";
import { Null } from "@icpswap/types";
import { Flex, TextButton } from "@icpswap/ui";
import QRCode from "components/qrcode";
import { ReactComponent as CopyIcon } from "assets/icons/Copy.svg";
import Copy, { CopyRef } from "components/Copy";
import { useRefreshBtcBalanceCallback } from "hooks/ck-bridge/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { useTips, MessageTypes } from "hooks/useTips";
import { useRefreshTriggerManager } from "hooks/index";
import { useTranslation } from "react-i18next";

interface BtcBridgeMintProps {
  token: Token;
  balance: BigNumber | Null;
  btc_address: string | Null;
}

export function BtcBridgeMint({ token, balance, btc_address }: BtcBridgeMintProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const principal = useAccountPrincipal();
  const copyRef = useRef<CopyRef>(null);
  const [openTip] = useTips();
  const [, setRefreshTrigger] = useRefreshTriggerManager("BtcBalance");

  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    if (copyRef) {
      copyRef?.current?.copy();
    }
  };

  const refreshBtcBalance = useRefreshBtcBalanceCallback();

  const handleRefreshBalance = useCallback(async () => {
    if (!principal || loading) return;

    setLoading(true);

    const result = await refreshBtcBalance(principal.toString(), undefined);

    if ("OK" in result) {
      openTip(t("ck.bitcoin.mint.success"), MessageTypes.success);
      setRefreshTrigger();
      setLoading(false);
      return;
    }

    if ("Err" in result) {
      const err = result.Err;

      if ("NoNewUtxos" in err) {
        const current_confirmations = err.NoNewUtxos.current_confirmations[0];
        const required_confirmations = err.NoNewUtxos.required_confirmations;

        if (!current_confirmations) {
          openTip(t("ck.bitcoin.no.confirmations"), MessageTypes.error);
        } else {
          openTip(t("ck.bitcoin.confirmations.less.than", { number: required_confirmations }), MessageTypes.error);
        }
      } else if ("AlreadyProcessing" in err) {
        openTip(t("ck.bitcoin.processing"), MessageTypes.error);
      } else if ("GenericError" in err) {
        openTip(err.GenericError.error_message, MessageTypes.error);
      } else if ("TemporarilyUnavailable" in err) {
        openTip(err.TemporarilyUnavailable, MessageTypes.error);
      } else {
        openTip(t("ck.bitcoin.failed.check"), MessageTypes.error);
      }
    }

    setLoading(false);
  }, [setLoading, loading, principal, setRefreshTrigger]);

  useEffect(() => {
    const timer = setInterval(
      () => {
        if (principal) {
          refreshBtcBalance(principal.toString(), undefined);
        }
      },
      1000 * 5 * 60,
    );

    if (principal) {
      refreshBtcBalance(principal.toString(), undefined);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [principal]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshTrigger();
    }, 10000);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [setRefreshTrigger]);

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
              <Typography>{t("bitcoin.deposit.address")}</Typography>
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
                {btc_address ?? "--"}

                {btc_address ? (
                  <Box component="span" sx={{ margin: "0 0 0 4px", cursor: "pointer" }}>
                    <CopyIcon />
                  </Box>
                ) : null}
              </Typography>

              <TextButton sx={{ fontSize: "12px" }} link={`https://mempool.space/address/${btc_address}`}>
                {t("bitcoin.check.explorer")}
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
                onClick={handleRefreshBalance}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {t("bitcoin.check.incoming")}
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              padding: "10px",
              display: "flex",
              justifyContent: "center",
              borderRadius: "8px",
              background: "#ffffff",
            }}
          >
            <QRCode width={120} height={120} value={btc_address ?? ""} />
          </Box>
        </Flex>
      </Box>

      <Copy content={btc_address ?? ""} hide ref={copyRef} />

      <Flex
        fullWidth
        vertical
        gap="16px 0"
        align="flex-start"
        sx={{ padding: "16px", borderRadius: "16px", border: `1px solid ${theme.palette.background.level4}` }}
      >
        {/* <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>Minimum Minting Amount</Trans>
          </Typography>

          <Typography>
            <Trans>0.001 ckBTC</Trans>
          </Typography>
        </Flex> */}

        <Flex fullWidth justify="space-between">
          <Typography>{t("bitcoin.kyt.fee")}</Typography>
          <Typography>0.00002 ckBTC</Typography>
        </Flex>
      </Flex>
    </>
  );
}
