import { useCallback } from "react";
import { Token } from "@icpswap/swap-sdk";
import BigNumber from "bignumber.js";
import { getActorIdentity } from "components/Identity";
import { useErrorTip, TIP_OPTIONS } from "hooks/useTips";
import { t } from "@lingui/macro";
import { useApprove } from "hooks/token/useApprove";
import { useAccountPrincipal } from "store/auth/hooks";
import { isUseTransfer } from "utils/token/index";
import { tokenTransfer } from "hooks/token/calls";
import { SubAccount } from "@dfinity/ledger-icp";

export function useTokenSubAccountTransfer() {
  const [openErrorTip] = useErrorTip();

  const principal = useAccountPrincipal();

  return useCallback(
    async (token: Token, amount: string, address: string, options?: TIP_OPTIONS) => {
      if (!principal) {
        openErrorTip(t`Failed to transfer: no principal`);
        return false;
      }

      const identity = await getActorIdentity();

      const subAccount = SubAccount.fromPrincipal(principal);

      const { status, message } = await tokenTransfer({
        identity,
        to: address,
        canisterId: token.address,
        amount: new BigNumber(amount),
        from: principal.toString() ?? "",
        subaccount: [...subAccount.toUint8Array()],
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

export function useTokenApprove() {
  const principal = useAccountPrincipal();
  const approve = useApprove();
  const [openErrorTip] = useErrorTip();

  return useCallback(
    async (token: Token, amount: string, spender: string, options?: TIP_OPTIONS) => {
      const { status, message } = await approve({
        canisterId: token.address,
        spender,
        value: amount,
        account: principal,
      });

      if (status === "err") {
        openErrorTip(`Failed to approve ${token.symbol}: ${message}`, options);
        return false;
      }

      return true;
    },
    [approve, principal],
  );
}

export function useTokenTransferOrApprove() {
  const approve = useTokenApprove();
  const transfer = useTokenSubAccountTransfer();

  return useCallback(
    async (token: Token, amount: string, principal: string, options?: TIP_OPTIONS) => {
      if (isUseTransfer(token)) {
        return await transfer(token, amount, principal, options);
      }

      return await approve(token, amount, principal, options);
    },
    [transfer, approve],
  );
}
