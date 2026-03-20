import { withdraw_eth } from "@icpswap/hooks";
import type { Token } from "@icpswap/swap-sdk";
import { ckETH } from "@icpswap/tokens";
import { ResultStatus } from "@icpswap/types";
import { formatTokenAmount, numberToString } from "@icpswap/utils";
import { MINTER_ID } from "constants/ckETH";
import { useApprove } from "hooks/token";
import { MessageTypes, useTips } from "hooks/useTips";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useUpdateEthDissolveTx } from "store/web3/hooks";

export function useDissolveCallback() {
  const { t } = useTranslation();
  const principal = useAccountPrincipalString();
  const [loading, setLoading] = useState(false);

  const updateUserTx = useUpdateEthDissolveTx();
  const [openTip] = useTips();
  const approve = useApprove();

  const dissolve_call = useCallback(
    async (amount: string | number, address: string, token: Token) => {
      if (!principal || !token || !address) return;

      const withdraw_amount = BigInt(numberToString(formatTokenAmount(amount, token.decimals)));

      setLoading(true);

      const { status, message } = await approve({
        canisterId: ckETH.address,
        spender: MINTER_ID,
        value: withdraw_amount,
        account: principal,
      });

      if (status === ResultStatus.ERROR) {
        openTip(message ?? t`Failed to approve ckETH`, MessageTypes.error);
        setLoading(false);
        return;
      }

      const {
        status: withdraw_status,
        message: withdraw_message,
        data,
      } = await withdraw_eth(MINTER_ID, address, withdraw_amount);

      if (withdraw_status === ResultStatus.ERROR) {
        openTip(withdraw_message ?? t("ck.ether.dissolve.loading"), MessageTypes.error);
      } else {
        openTip(t("ck.dissolve.submitted", { symbol: "ETH" }), MessageTypes.success);
        if (data?.block_index) {
          updateUserTx(principal, data.block_index, undefined, withdraw_amount.toString());
        }
      }

      setLoading(false);

      return withdraw_status === ResultStatus.OK;
    },
    [approve, updateUserTx],
  );

  return useMemo(
    () => ({
      loading,
      dissolve_call,
    }),
    [loading, dissolve_call],
  );
}
