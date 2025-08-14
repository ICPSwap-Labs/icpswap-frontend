import { useCallback, useMemo, useState } from "react";
import { retrieveBTC, useApprove } from "hooks/ck-btc";
import { useAccountPrincipalString } from "store/auth/hooks";
import { formatTokenAmount, numberToString } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { Null, ResultStatus } from "@icpswap/types";
import { MessageTypes, useTips } from "hooks/useTips";
import { useUpdateUserBTCTx } from "store/wallet/hooks";
import { useTranslation } from "react-i18next";

export interface DissolveProps {
  amount: string | number | Null;
  address: string | Null;
  token: Token | Null;
}

export function useDissolve() {
  const principal = useAccountPrincipalString();
  const [openTip] = useTips();
  const [loading, setLoading] = useState(false);

  const approve = useApprove();
  const updateBTCTx = useUpdateUserBTCTx();
  const { t } = useTranslation();

  const dissolve_call = useCallback(
    async ({ amount, address, token }: DissolveProps) => {
      if (!amount || !principal || !token || !address) return;

      const approveAmount = BigInt(numberToString(formatTokenAmount(amount, token.decimals)));

      setLoading(true);

      const { status, message } = await approve({ amount: approveAmount });

      if (status === ResultStatus.ERROR) {
        openTip(message ?? `Failed to approve ckBTC`, MessageTypes.error);
        setLoading(false);
        return;
      }

      const { status: dissolveResult, message: dissolveMessage, data } = await retrieveBTC(address, approveAmount);

      if (dissolveResult === ResultStatus.ERROR) {
        openTip(dissolveMessage ?? `Failed to dissolve`, MessageTypes.error);
      } else {
        openTip(t("ck.dissolve.submitted", { symbol: "BTC" }), MessageTypes.success);

        if (data?.block_index) {
          updateBTCTx(principal, data.block_index, undefined, approveAmount.toString());
        }
      }

      setLoading(false);

      return dissolveResult === ResultStatus.OK;
    },
    [approve, updateBTCTx, principal],
  );

  return useMemo(() => ({ loading, dissolve_call }), [loading, dissolve_call]);
}
