import { Token } from "@icpswap/swap-sdk";
import { BigNumber } from "@icpswap/utils";
// import { useTheme } from "components/Mui";
import { useState, useCallback } from "react";
import { Null } from "@icpswap/types";
import { useAccountPrincipal } from "store/auth/hooks";
import { useTips, MessageTypes } from "hooks/useTips";
import { useTranslation } from "react-i18next";
import { useOisyDisabledTips } from "hooks/useOisyDisabledTips";
import { useInterval, updateDogeBalance } from "@icpswap/hooks";
import { BitcoinStyleMintUI } from "components/ck-bridge/ui/BitcoinStyleMintUI";
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
  }, [setLoading, loading, principal, refetch]);

  useInterval(
    useCallback(() => {
      if (principal) {
        updateDogeBalance(principal.toString());
      }
    }, [principal]),
    1000 * 5 * 60,
  );

  useOisyDisabledTips({ page: "ck-bridge" });

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
