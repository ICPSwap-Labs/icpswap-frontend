import type { InfoTransactionResponse } from "@icpswap/types";
import i18n from "i18n";

export const RECORD_TYPE: { [key: string]: string } = {
  Swap: i18n.t("common.swap"),
  IncreaseLiquidity: i18n.t("swap.add.liquidity"),
  DecreaseLiquidity: i18n.t("swap.remove.liquidity"),
  Mint: i18n.t("swap.add.liquidity"),
  AddLiquidity: i18n.t("swap.add.liquidity"),
  Claim: i18n.t("common.collect"),
};

interface SwapTransactionTypeProps {
  transaction: InfoTransactionResponse;
}

export function SwapTransactionType({ transaction }: SwapTransactionTypeProps) {
  return <>{RECORD_TYPE[transaction.actionType]}</>;
}
