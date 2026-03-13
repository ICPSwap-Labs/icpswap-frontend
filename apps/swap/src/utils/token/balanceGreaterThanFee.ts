import { Token } from "@icpswap/swap-sdk";
import { NumberType } from "@icpswap/types";
import { BigNumber } from "@icpswap/utils";

export function isBalanceGreaterThanFee(balance: NumberType, token: Token) {
  return new BigNumber(balance.toString()).isGreaterThan(token.transFee);
}
