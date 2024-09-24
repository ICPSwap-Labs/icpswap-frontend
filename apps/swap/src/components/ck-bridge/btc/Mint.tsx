import { Token } from "@icpswap/swap-sdk";
import { parseTokenAmount, toSignificantWithGroupSeparator, BigNumber } from "@icpswap/utils";
import { Trans, t } from "@lingui/macro";
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

interface BtcBridgeMintProps {
  token: Token;
  balance: BigNumber | Null;
  btc_address: string | Null;
}

export function BtcBridgeMint({ token, balance, btc_address }: BtcBridgeMintProps) {
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
      openTip(t`ckBTC Minted successfully`, MessageTypes.success);
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
          openTip(t`No new confirmed BTC`, MessageTypes.error);
        } else {
          openTip(t`Bitcoin network block confirmations are less than ${required_confirmations}`, MessageTypes.error);
        }
      } else if ("AlreadyProcessing" in err) {
        openTip(t`Already processing`, MessageTypes.error);
      } else if ("GenericError" in err) {
        openTip(err.GenericError.error_message, MessageTypes.error);
      } else if ("TemporarilyUnavailable" in err) {
        openTip(err.TemporarilyUnavailable, MessageTypes.error);
      } else {
        openTip(t`Failed to check`, MessageTypes.error);
      }
    }

    setLoading(false);
  }, [setLoading, loading, principal, setRefreshTrigger]);

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
      <Flex
        sx={{
          width: "100%",
          padding: "20px 16px",
          background: theme.palette.background.level2,
          borderRadius: "16px",
          "@media(max-width: 640px)": {
            flexDirection: "column",
            gap: "16px 0",
          },
        }}
        justify="center"
        align="flex-start"
        gap="0 32px"
      >
        <Box
          sx={{
            padding: "12px",
            border: `1px solid ${theme.palette.background.level4}`,
            display: "flex",
            justifyContent: "center",
            borderRadius: "8px",
          }}
        >
          <QRCode value={btc_address ?? ""} />
        </Box>

        <Box>
          <Box>
            <Flex gap="0 6px">
              <Typography>
                <Trans>Balance</Trans>
              </Typography>
            </Flex>

            <Flex gap="0 4px" sx={{ margin: "8px 0 0 0" }}>
              <Typography
                sx={{
                  color: "text.primary",
                  fontWeight: 600,
                  fontSize: "18px",
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

          <Box sx={{ margin: "32px 0 0 0" }}>
            <Typography>
              <Trans>BTC Deposit Address</Trans>
            </Typography>
            <Typography
              component="div"
              sx={{
                color: "text.primary",
                maxWidth: "304px",
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
              <Trans>Check on Bitcoin Explorer</Trans>
            </TextButton>
          </Box>

          <Box sx={{ margin: "20px 0 0 0" }}>
            <Button
              variant="outlined"
              onClick={handleRefreshBalance}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              <Trans>Check for incoming BTC</Trans>
            </Button>
          </Box>
        </Box>
      </Flex>

      <Copy content={btc_address ?? ""} hide ref={copyRef} />

      <Flex
        fullWidth
        vertical
        gap="16px 0"
        align="flex-start"
        sx={{ padding: "16px", borderRadius: "16px", border: `1px solid ${theme.palette.background.level4}` }}
      >
        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>Minimum Minting Amount</Trans>
          </Typography>

          <Typography>
            <Trans>0.001 ckBTC</Trans>
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>KYT Fee</Trans>
          </Typography>

          <Typography>
            <Trans>0.00002 ckBTC</Trans>
          </Typography>
        </Flex>
      </Flex>
    </>
  );
}
