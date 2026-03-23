import type { Token } from "@icpswap/swap-sdk";
import { ResultStatus } from "@icpswap/types";
import { sleep } from "@icpswap/utils";
import { deposit, withdraw } from "hooks/swap/v3Calls";
import { MessageTypes, useTips } from "hooks/useTips";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { TokenInfo } from "types/token";

export interface ReclaimArgs {
  poolId: string;
  token: TokenInfo | Token;
  name?: string;
  type: "unDeposit" | "unUsed";
  balance: bigint;
  refresh?: () => void;
}

export function useReclaim() {
  const { t } = useTranslation();
  const [openTip] = useTips();

  return useCallback(
    async ({ token, balance, poolId, name, type, refresh }: ReclaimArgs) => {
      const amount = balance;

      const tokenId = "canisterId" in token ? token.canisterId : token.address;
      const tokenFee = BigInt(token.transFee);

      if (amount !== BigInt(0)) {
        if (type === "unDeposit") {
          const result = await deposit(poolId, tokenId, amount, tokenFee);

          if (result.status === ResultStatus.OK) {
            openTip(t("swap.withdrawal.submitted"), MessageTypes.success);

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

          openTip(t("swap.withdrawal.submitted"), MessageTypes.success);

          withdraw(poolId, tokenId, tokenFee, amount).then(({ status, message }) => {
            if (status === ResultStatus.OK) {
              if (refresh) refresh();
            } else {
              openTip(message ?? `Failed to Withdraw ${name ?? ""} ${token.symbol}`, MessageTypes.error);
            }
          });
        }
      }
    },
    [openTip, t],
  );
}
