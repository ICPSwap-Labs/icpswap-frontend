import { useCallback, useMemo, useState } from "react";
import { parseTokenAmount } from "@icpswap/utils";
import { TokenInfo } from "types/token";
import { useTips, MessageTypes } from "hooks/useTips";
import { destroyPassCode, withdrawPCMBalance } from "@icpswap/hooks";
import { type PassCode, type PCMMetadata, ResultStatus } from "@icpswap/types";
import { type Token } from "@icpswap/swap-sdk";

export interface WithdrawPCMBalanceArgs {
  token: TokenInfo | Token;
  name: string | undefined;
  type: "code" | "unUsed";
  metadata: PCMMetadata | undefined | null;
  code?: PassCode | undefined;
  amount: bigint | number | string;
}

export function useWithdrawPCMBalanceCallback() {
  const [openTip, closeTip] = useTips();
  const [loading, setLoading] = useState(false);

  const callback = useCallback(async (args: WithdrawPCMBalanceArgs[]) => {
    return await Promise.all(
      args.map(async ({ token, name, type, code, amount: __amount }) => {
        const amount = BigInt(__amount);
        const tokenTransFee = BigInt(token.transFee);
        const unavailableClaim =
          amount === BigInt(0) || (type === "code" ? amount < tokenTransFee * BigInt(2) : amount < tokenTransFee);

        if (unavailableClaim) return;

        setLoading(true);

        const loadingKey = openTip(
          `Withdraw your ${parseTokenAmount(amount, token.decimals).toFormat()} ${token.symbol}`,
          MessageTypes.loading,
        );

        if (type === "code" && !!code) {
          const result = await destroyPassCode(code.token0.toString(), code.token1.toString(), code.fee);

          if (result.status === ResultStatus.OK) {
            const result = await withdrawPCMBalance(amount, tokenTransFee);
            if (result.status === ResultStatus.OK) {
              openTip(`Withdrew ${name} successfully`, MessageTypes.success);
            } else {
              openTip(`Failed to Withdraw ${name}: ${result.message}`, MessageTypes.error);
            }
          } else {
            openTip(`Failed to Withdraw: ${result.message ?? ""}`, MessageTypes.error);
          }
        } else {
          const result = await withdrawPCMBalance(amount, tokenTransFee);

          if (result.status === ResultStatus.OK) {
            openTip(`Withdrew ${name} successfully`, MessageTypes.success);
          } else {
            openTip(result.message ? result.message : `Failed to Withdraw ${name}`, MessageTypes.error);
          }
        }

        closeTip(loadingKey);
        setLoading(false);
      }),
    );
  }, []);

  return useMemo(() => ({ loading, callback }), [loading, callback]);
}
