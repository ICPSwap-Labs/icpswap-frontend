import { DOGE_MINTER_ID } from "@icpswap/constants";
import { retrieveDogeWithApproval } from "@icpswap/hooks";
import type { Token } from "@icpswap/swap-sdk";
import { ResultStatus } from "@icpswap/types";
import { formatTokenAmount, numberToString } from "@icpswap/utils";
import { useUpdateDissolveTx } from "hooks/ck-bridge/doge/useDissolveTxManager";
import { useUserTokenApprove } from "hooks/token/useApprove";
import { MessageTypes, useTips } from "hooks/useTips";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export interface DissolveProps {
  amount: string | number;
  address: string;
  token: Token;
}

export function useDissolve() {
  const [openTip] = useTips();
  const [loading, setLoading] = useState(false);

  const approve = useUserTokenApprove();
  const updateDissolveTx = useUpdateDissolveTx();
  const { t } = useTranslation();

  const dissolve_call = useCallback(
    async ({ amount, address, token }: DissolveProps) => {
      if (!amount || !token || !address) return;

      const approveAmount = BigInt(numberToString(formatTokenAmount(amount, token.decimals)));

      setLoading(true);

      const { status, message } = await approve({
        tokenId: token.address,
        spender: DOGE_MINTER_ID,
        amount: approveAmount,
      });

      if (status === ResultStatus.ERROR) {
        openTip(message ?? t("common.error.failed.approve", { symbol: token.symbol }), MessageTypes.error);
        setLoading(false);
        return;
      }

      const {
        status: dissolveResult,
        message: dissolveMessage,
        data,
      } = await retrieveDogeWithApproval({ address, amount: approveAmount.toString() });

      if (dissolveResult === ResultStatus.ERROR) {
        openTip(dissolveMessage ?? t("common.error.failed.dissolve", { symbol: token.symbol }), MessageTypes.error);
      } else {
        openTip(t("ck.dissolve.submitted", { symbol: token.symbol.replace("ck", "") }), MessageTypes.success);

        if (data?.block_index) {
          updateDissolveTx({ block: data.block_index.toString(), amount: approveAmount.toString() });
        }
      }

      setLoading(false);

      return dissolveResult === ResultStatus.OK;
    },
    [approve, updateDissolveTx, openTip, t],
  );

  return useMemo(() => ({ loading, dissolve_call }), [loading, dissolve_call]);
}
