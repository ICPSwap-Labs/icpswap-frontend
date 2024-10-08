import { useCallback } from "react";
import { parseTokenAmount } from "@icpswap/utils";
import { ResultStatus } from "@icpswap/types";
import { TokenInfo } from "types/token";
import { useTips, MessageTypes } from "hooks/useTips";
import { withdraw, deposit } from "hooks/swap/v3Calls";
import { t } from "@lingui/macro";
import { Token } from "@icpswap/swap-sdk";

export interface ReclaimArgs {
  poolId: string;
  token: TokenInfo | Token;
  name?: string;
  type: "unDeposit" | "unUsed";
  balance: bigint;
}

export function useReclaim() {
  const [openTip, closeTip] = useTips();

  return useCallback(async ({ token, balance, name, poolId, type }: ReclaimArgs) => {
    let reclaimSuccessfully = false;

    const loadingKey = openTip(
      `Withdraw your ${parseTokenAmount(balance, token.decimals).toFormat()} ${token.symbol}`,
      MessageTypes.loading,
    );

    const amount = balance;

    const tokenId = "canisterId" in token ? token.canisterId : token.address;
    const tokenFee = BigInt(token.transFee);

    if (amount !== BigInt(0)) {
      if (type === "unDeposit") {
        const result = await deposit(poolId, tokenId, amount, tokenFee);

        if (result.status === ResultStatus.OK) {
          const result = await withdraw(poolId, tokenId, tokenFee, amount - tokenFee);
          if (result.status === ResultStatus.OK) {
            openTip(t`Withdrew ${name ?? ""} ${token.symbol} successfully`, MessageTypes.success);
            reclaimSuccessfully = true;
          } else {
            openTip(`Failed to Withdraw ${name ?? ""} ${token.symbol}: ${result.message}`, MessageTypes.error);
          }
        } else {
          openTip(`Failed to Withdraw: ${result.message ?? ""}`, MessageTypes.error);
        }
      } else {
        const result = await withdraw(poolId, tokenId, tokenFee, amount);

        if (result.status === ResultStatus.OK) {
          openTip(`Withdrew ${name ?? ""} ${token?.symbol} successfully`, MessageTypes.success);
          reclaimSuccessfully = true;
        } else {
          openTip(
            result.message ? result.message : `Failed to Withdraw ${name ?? ""} ${token.symbol}`,
            MessageTypes.error,
          );
        }
      }
    }

    closeTip(loadingKey);

    return reclaimSuccessfully;
  }, []);
}
