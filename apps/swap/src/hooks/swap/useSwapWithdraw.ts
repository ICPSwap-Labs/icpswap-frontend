import { useCallback } from "react";
import { Token } from "@icpswap/swap-sdk";
import { withdraw } from "@icpswap/hooks";
import { useErrorTip } from "hooks/useTips";
import { OpenExternalTip } from "types/index";
import i18n from "i18n/index";

export function useSwapWithdraw() {
  const [openErrorTip] = useErrorTip();

  return useCallback(async (token: Token, poolId: string, amount: string, openExternalTip?: OpenExternalTip) => {
    const { status, message } = await withdraw(poolId, token.address, BigInt(token.transFee), BigInt(amount));

    if (status === "err") {
      if (openExternalTip) {
        openExternalTip({ message });
      } else {
        openErrorTip(i18n.t("common.failed.withdraw.error.with.reclaimMsg", { symbol: token.symbol, message }));
      }

      return false;
    }

    return true;
  }, []);
}
