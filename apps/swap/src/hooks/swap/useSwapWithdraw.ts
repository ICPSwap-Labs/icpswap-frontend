import { withdraw } from "@icpswap/hooks";
import type { Token } from "@icpswap/swap-sdk";
import { useErrorTip } from "hooks/useTips";
import i18n from "i18n/index";
import { useCallback } from "react";
import type { OpenExternalTip } from "types/index";

export function useSwapWithdraw() {
  const [openErrorTip] = useErrorTip();

  return useCallback(
    async (token: Token, poolId: string, amount: string, openExternalTip?: OpenExternalTip) => {
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
    },
    [openErrorTip],
  );
}
