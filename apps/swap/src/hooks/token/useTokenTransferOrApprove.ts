import { useCallback } from "react";
import { Token } from "@icpswap/swap-sdk";
import BigNumber from "bignumber.js";
import { useErrorTip, TIP_OPTIONS } from "hooks/useTips";
import { useApprove } from "hooks/token/useApprove";
import { useAccountPrincipal } from "store/auth/hooks";
import { isUseTransferByStandard } from "utils/token/index";
import { tokenTransfer } from "hooks/token/calls";
import { SubAccount } from "@dfinity/ledger-icp";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";

export interface UseTokenSubAccountTransferArgs {
  token: Token;
  amount: string;
  address: string;
  options?: TIP_OPTIONS;
}

export function useTokenSubAccountTransfer() {
  const principal = useAccountPrincipal();

  const [openErrorTip] = useErrorTip();

  return useCallback(
    async ({ token, address, amount, options }: UseTokenSubAccountTransferArgs) => {
      if (!principal) {
        openErrorTip(`Failed to transfer: no principal`);
        return false;
      }

      const subAccount = SubAccount.fromPrincipal(principal);

      const { status, message } = await tokenTransfer({
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

interface UseTokenApproveArgs {
  token: Token;
  amount: string;
  spender: string;
  options?: TIP_OPTIONS;
  standard: TOKEN_STANDARD;
}

export function useTokenApprove() {
  const principal = useAccountPrincipal();
  const approve = useApprove();
  const [openErrorTip] = useErrorTip();

  return useCallback(
    async ({ token, amount, spender, standard, options }: UseTokenApproveArgs) => {
      const { status, message } = await approve({
        canisterId: token.address,
        spender,
        value: amount,
        account: principal,
        standard,
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

export interface UseTokenTransferOrApproveArgs {
  token: Token;
  amount: string;
  to_owner: string;
  standard: TOKEN_STANDARD;
  options?: TIP_OPTIONS;
}

export function useTokenTransferOrApprove() {
  const approve = useTokenApprove();
  const transfer = useTokenSubAccountTransfer();

  return useCallback(
    async ({ token, amount, to_owner, options, standard }: UseTokenTransferOrApproveArgs) => {
      if (isUseTransferByStandard(standard)) {
        return await transfer({ token, amount, address: to_owner, options });
      }

      return await approve({
        token,
        amount,
        spender: to_owner,
        options,
        standard,
      });
    },
    [transfer, approve],
  );
}
