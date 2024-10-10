import { useCallback } from "react";
import { ResultStatus } from "@icpswap/types";
import { TokenInfo } from "types/token";
import { useTips, MessageTypes } from "hooks/useTips";
import { withdraw, deposit } from "hooks/swap/v3Calls";
import { t } from "@lingui/macro";
import { Token } from "@icpswap/swap-sdk";
import { sleep } from "@icpswap/utils";

export interface ReclaimArgs {
  poolId: string;
  token: TokenInfo | Token;
  name?: string;
  type: "unDeposit" | "unUsed";
  balance: bigint;
  refresh?: () => void;
}

export function useReclaim() {
  const [openTip] = useTips();

  return useCallback(async ({ token, balance, poolId, name, type, refresh }: ReclaimArgs) => {
    const amount = balance;

    const tokenId = "canisterId" in token ? token.canisterId : token.address;
    const tokenFee = BigInt(token.transFee);

    if (amount !== BigInt(0)) {
      if (type === "unDeposit") {
        const result = await deposit(poolId, tokenId, amount, tokenFee);

        if (result.status === ResultStatus.OK) {
          openTip(t`Withdrawal submitted`, MessageTypes.success);

          await sleep(2000);

          withdraw(poolId, tokenId, tokenFee, amount - tokenFee).then(({ status, message }) => {
            if (status === ResultStatus.OK) {
              if (refresh) refresh();
            } else {
              openTip(message ?? `Failed to Withdraw ${name ?? ""} ${token.symbol}`, MessageTypes.error);
            }
          });
        } else {
          openTip(`Failed to deposit: ${result.message ?? ""}`, MessageTypes.error);
        }
      } else {
        await sleep(2000);

        openTip(t`Withdrawal submitted`, MessageTypes.success);

        withdraw(poolId, tokenId, tokenFee, amount).then(({ status, message }) => {
          if (status === ResultStatus.OK) {
            if (refresh) refresh();
          } else {
            openTip(message ?? `Failed to Withdraw ${name ?? ""} ${token.symbol}`, MessageTypes.error);
          }
        });
      }
    }
  }, []);
}
