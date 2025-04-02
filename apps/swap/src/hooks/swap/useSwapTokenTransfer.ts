import { useCallback } from "react";
import { BigNumber } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { useErrorTip, TIP_OPTIONS } from "hooks/useTips";
import { useAccountPrincipal } from "store/auth/hooks";
import { tokenTransfer } from "hooks/token/calls";
import { SubAccount } from "@dfinity/ledger-icp";

export function useSwapTransfer() {
  const [openErrorTip] = useErrorTip();

  const principal = useAccountPrincipal();

  return useCallback(
    async (token: Token, amount: string, poolId: string, options?: TIP_OPTIONS) => {
      if (!principal) {
        openErrorTip(`Failed to transfer: no principal`);
        return false;
      }

      const { status, message } = await tokenTransfer({
        to: poolId,
        canisterId: token.address,
        amount: new BigNumber(amount),
        from: principal?.toString() ?? "",
        subaccount: [...SubAccount.fromPrincipal(principal).toUint8Array()],
        fee: token.transFee,
        decimals: token.decimals,
      });

      if (status === "err") {
        openErrorTip(`Failed to transfer ${token.symbol}: ${message}`, options);
        return false;
      }

      return true;
    },
    [principal],
  );
}
