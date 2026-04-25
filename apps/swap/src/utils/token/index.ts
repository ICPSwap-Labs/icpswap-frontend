import type { Token } from "@icpswap/swap-sdk";
import type { TOKEN_STANDARD } from "@icpswap/token-adapter";
import { BigNumber, numberToString } from "@icpswap/utils";

export function isUseTransferByStandard(standard: TOKEN_STANDARD) {
  return standard.includes("ICRC1");
}

export function isUseTransfer(token: Token | undefined) {
  if (token === undefined) return false;
  return isUseTransferByStandard(token.standard as TOKEN_STANDARD);
}

export function actualAmountToPool(token: Token, amount: string) {
  if (isUseTransfer(token)) {
    if (!new BigNumber(amount).minus(token.transFee).isGreaterThan(0)) {
      return "0";
    }
    return numberToString(new BigNumber(amount).minus(token.transFee));
  }
  return amount;
}
