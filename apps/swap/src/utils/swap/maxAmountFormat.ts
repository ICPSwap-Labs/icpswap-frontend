import BigNumber from "bignumber.js";
import { SAFE_DECIMALS_LENGTH } from "constants/index";

/**
 * Given some token amount, check and format the amount by the max decimals
 * @param amount token amount
 * @param decimals token decimals
 */
export function maxAmountFormat(amount: string, decimals: number): string {
  if (!amount) return amount;

  if (decimals > SAFE_DECIMALS_LENGTH) {
    return new BigNumber(amount).toFixed(SAFE_DECIMALS_LENGTH);
  }

  return amount;
}
