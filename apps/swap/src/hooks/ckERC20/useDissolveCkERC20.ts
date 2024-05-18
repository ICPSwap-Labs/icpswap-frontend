import { useAccountPrincipalString } from "store/auth/hooks";
import { useCallback, useMemo } from "react";
import { useTips, MessageTypes } from "hooks/useTips";
import { principalToBytes32 } from "utils/ic/index";
import { formatTokenAmount } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { MINTER_CANISTER_ID } from "constants/ckERC20";
import { ckETH } from "constants/ckETH";
import { useApprove } from "hooks/token/index";
import { ResultStatus } from "@icpswap/types";
import { t } from "@lingui/macro";
import { withdrawErc20Token } from "@icpswap/hooks";
import { Principal } from "@dfinity/principal";

export function useDissolveCkERC20() {
  const principal = useAccountPrincipalString();
  const [openTip] = useTips();

  const bytes32 = useMemo(() => {
    if (principal) return principalToBytes32(principal);
    return undefined;
  }, [principal]);

  const approve = useApprove();

  return useCallback(
    async (ckErc20Token: Token, rawAmount: string | number, recipient: string) => {
      if (!bytes32) return undefined;

      const amount = formatTokenAmount(rawAmount, ckErc20Token.decimals).toString();

      // Approve 1 ckETH for tx_fee
      const ckETHApproveResult = await approve({
        canisterId: ckETH.address,
        spender: MINTER_CANISTER_ID,
        // TODO: approve amount gas fee
        value: formatTokenAmount(1, ckETH.decimals).toString(),
        account: principal,
      });

      if (ckETHApproveResult.status === ResultStatus.ERROR) {
        openTip(ckETHApproveResult.message ?? t`Failed to approve ${ckETH.symbol}`, MessageTypes.error);
        return;
      }

      const erc20TokenApproveResult = await approve({
        canisterId: ckErc20Token.address,
        spender: MINTER_CANISTER_ID,
        value: amount,
        account: principal,
      });

      if (erc20TokenApproveResult.status === ResultStatus.ERROR) {
        openTip(erc20TokenApproveResult.message ?? t`Failed to approve ${ckErc20Token.symbol}`, MessageTypes.error);
        return;
      }

      const result = await withdrawErc20Token({
        minter_id: MINTER_CANISTER_ID,
        ledger_id: Principal.fromText(ckErc20Token.address),
        recipient,
        amount: BigInt(amount),
      });

      if (result.status === ResultStatus.ERROR) {
        openTip(result.message ?? t`Failed to withdraw ${ckErc20Token.symbol}`, MessageTypes.error);
      } else {
        openTip(t`Withdraw ${rawAmount} ${ckErc20Token.symbol} successfully`, MessageTypes.success);
      }

      return result;
    },
    [bytes32, principal],
  );
}
