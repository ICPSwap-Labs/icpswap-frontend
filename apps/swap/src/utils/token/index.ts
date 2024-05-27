import { numberToString, BigNumber } from "@icpswap/utils";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";
import { Token } from "@icpswap/swap-sdk";

export function isUseTransfer(token: Token | undefined) {
  if (token === undefined) return false;
  return token.standard.includes("ICRC1") || token.standard === TOKEN_STANDARD.ICP;
}

export function isUseTransferByStandard(standard: TOKEN_STANDARD) {
  return standard.includes("ICRC1") || standard === TOKEN_STANDARD.ICP;
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
