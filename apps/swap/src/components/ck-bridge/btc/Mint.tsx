import { BridgeChainName } from "@icpswap/constants";
import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { Flex } from "@icpswap/ui";
import type { BigNumber } from "@icpswap/utils";
import { BitcoinStyleMintUI } from "components/ck-bridge/ui/BitcoinStyleMintUI";
import { Typography, useTheme } from "components/Mui";
import { useRefreshBtcBalanceCallback } from "hooks/ck-bridge/index";
import { useOisyDisabledTips } from "hooks/useOisyDisabledTips";
import { MessageTypes, useTips } from "hooks/useTips";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccountPrincipal } from "store/auth/hooks";

interface BtcBridgeMintProps {
  token: Token;
  balance: BigNumber | string | Null;
  bitcoinAddress: string | Null;
  refetch: () => void;
}

export function BtcBridgeMint({ token, balance, bitcoinAddress, refetch }: BtcBridgeMintProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const principal = useAccountPrincipal();
  const [openTip] = useTips();

  const [loading, setLoading] = useState(false);

  const refreshBtcBalance = useRefreshBtcBalanceCallback();

  const handleRefreshBalance = useCallback(async () => {
    if (!principal || loading) return;

    setLoading(true);

    const result = await refreshBtcBalance(principal.toString(), undefined);

    if ("OK" in result) {
      openTip(t("ck.mint.submitted", { symbol: "BTC" }), MessageTypes.success);
      refetch();
      setLoading(false);
      return;
    }

    if ("Err" in result) {
      const err = result.Err;

      if ("NoNewUtxos" in err) {
        const current_confirmations = err.NoNewUtxos.current_confirmations[0];
        const required_confirmations = err.NoNewUtxos.required_confirmations;

        if (!current_confirmations) {
          openTip(t("ck.bridge.no.confirmations", { symbol: "BTC" }), MessageTypes.error);
        } else {
          openTip(
            t("ck.bridge.confirmations.less.than", {
              chainName: BridgeChainName.bitcoin,
              number: required_confirmations,
            }),
            MessageTypes.error,
          );
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
  }, [loading, principal, refetch, openTip, refreshBtcBalance, t]);

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
  }, [principal, refreshBtcBalance]);

  useOisyDisabledTips({ page: "ck-bridge" });

  return (
    <>
      <BitcoinStyleMintUI
        token={token}
        balance={balance}
        address={bitcoinAddress}
        onRefreshBalance={handleRefreshBalance}
        refreshLoading={loading}
        explorerLink={`https://mempool.space/address/${bitcoinAddress}`}
        explorerSymbol="bitcoin"
      />

      <Flex
        fullWidth
        vertical
        gap="16px 0"
        align="flex-start"
        sx={{ padding: "16px", borderRadius: "16px", border: `1px solid ${theme.palette.background.level4}` }}
      >
        <Flex fullWidth justify="space-between">
          <Typography>{t("bitcoin.kyt.fee")}</Typography>
          <Typography>0.00002 ckBTC</Typography>
        </Flex>
      </Flex>
    </>
  );
}
