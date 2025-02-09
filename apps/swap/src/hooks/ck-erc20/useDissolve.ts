import { useAccountPrincipalString } from "store/auth/hooks";
import { useCallback, useMemo, useState } from "react";
import { useTips, MessageTypes } from "hooks/useTips";
import { principalToBytes32 } from "utils/ic/index";
import { formatTokenAmount } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { MINTER_CANISTER_ID } from "constants/ckERC20";
import { ckETH } from "constants/ckETH";
import { useApprove } from "hooks/token/index";
import { ResultStatus } from "@icpswap/types";
import { withdrawErc20Token } from "@icpswap/hooks";
import { Principal } from "@dfinity/principal";
import { useTranslation } from "react-i18next";

export function useDissolveCallback() {
  const { t } = useTranslation();
  const principal = useAccountPrincipalString();
  const [openTip] = useTips();

  const [loading, setLoading] = useState(false);

  const bytes32 = useMemo(() => {
    if (principal) return principalToBytes32(principal);
    return undefined;
  }, [principal]);

  const approve = useApprove();

  const dissolve_call = useCallback(
    async (ckErc20Token: Token, rawAmount: string | number, recipient: string) => {
      if (!bytes32) return undefined;

      setLoading(true);

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
        openTip(
          ckETHApproveResult.message ?? t("common.failed.approve.error", { message: ckETH.symbol }),
          MessageTypes.error,
        );
        setLoading(false);
        return;
      }

      const erc20TokenApproveResult = await approve({
        canisterId: ckErc20Token.address,
        spender: MINTER_CANISTER_ID,
        value: amount,
        account: principal,
      });

      if (erc20TokenApproveResult.status === ResultStatus.ERROR) {
        openTip(
          erc20TokenApproveResult.message ?? t("common.failed.approve.error", { message: ckErc20Token.symbol }),
          MessageTypes.error,
        );
        setLoading(false);
        return;
      }

      const result = await withdrawErc20Token({
        minter_id: MINTER_CANISTER_ID,
        ledger_id: Principal.fromText(ckErc20Token.address),
        recipient,
        amount: BigInt(amount),
      });

      if (result.status === ResultStatus.ERROR) {
        if (result.message.includes("InsufficientFunds")) {
          openTip(t`Your wallet doesn't have enough ckETH (Gas fee) or ckUSDC to dissolve.`, MessageTypes.error);
        } else {
          openTip(
            result.message ?? t("common.failed.withdraw.error", { message: ckErc20Token.symbol }),
            MessageTypes.error,
          );
        }
      } else {
        openTip(t("common.withdraw.success", { message: `${rawAmount} ${ckErc20Token.symbol}` }), MessageTypes.success);
      }

      setLoading(false);

      return result.status === ResultStatus.OK;
    },
    [bytes32, principal, setLoading],
  );

  return useMemo(() => ({ loading, dissolve_call }), [loading, dissolve_call]);
}
