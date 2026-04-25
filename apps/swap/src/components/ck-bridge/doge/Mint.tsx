import { updateDogeBalance, useInterval } from "@icpswap/hooks";
import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import type { BigNumber } from "@icpswap/utils";
import { BitcoinStyleMintUI } from "components/ck-bridge/ui/BitcoinStyleMintUI";
import { MessageTypes, useTips } from "hooks/useTips";
// import { useTheme } from "components/Mui";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccountPrincipal } from "store/auth/hooks";
import { dogeAddressExplorer } from "utils/chain-key";

interface MintProps {
  token: Token;
  balance: BigNumber | string | Null;
  address: string | Null;
  refetch: () => void;
}

export function Mint({ token, balance, address, refetch }: MintProps) {
  const { t } = useTranslation();
  // const theme = useTheme();
  const principal = useAccountPrincipal();
  const [openTip] = useTips();
  const [loading, setLoading] = useState(false);

  const handleRefreshBalance = useCallback(async () => {
    if (!principal || loading) return;

    setLoading(true);

    const result = await updateDogeBalance(principal.toString());

    if ("OK" in result) {
      openTip(t("ck.mint.submitted", { symbol: "DOGE" }), MessageTypes.success);
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
          openTip(t("ck.bridge.no.confirmations", { symbol: "DOGE" }), MessageTypes.error);
        } else {
          openTip(
            t("ck.bridge.confirmations.less.than", { chainName: "Doge", number: required_confirmations }),
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
  }, [loading, principal, refetch, openTip, t]);

  useInterval({
    callback: useCallback(() => {
      if (principal) {
        updateDogeBalance(principal.toString());
      }
    }, [principal]),
    interval: 1000 * 5 * 60,
  });

  return (
    <>
      <BitcoinStyleMintUI
        token={token}
        balance={balance}
        address={address}
        onRefreshBalance={handleRefreshBalance}
        refreshLoading={loading}
        explorerLink={address ? dogeAddressExplorer(address) : ""}
        explorerSymbol="doge"
      />

      {/* <Flex
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
      </Flex> */}
    </>
  );
}
