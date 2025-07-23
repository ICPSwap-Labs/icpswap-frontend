import { DepositInfo } from "@icpswap/types";
import { __getTokenInfo } from "hooks/token";
import { parseTokenAmount, shorten } from "@icpswap/utils";
import { SWAP_TRANSACTIONS_FAILED_STATUS, SwapTransactionResult } from "utils/transaction/constant";

export async function swapTransactionDepositFormat(info: DepositInfo): Promise<SwapTransactionResult> {
  const __status = info.status;
  const message = info.err[0];
  const status = Object.keys(__status)[0];

  const { to, token, from, amount } = info.transfer;
  const tokenInfo = await __getTokenInfo(token.toString());

  const details = !tokenInfo
    ? "No token info, please reload the page"
    : `${shorten(from.owner.toString())} transfer ${parseTokenAmount(amount, tokenInfo.decimals).toFormat()} ${
        tokenInfo.symbol
      } to ${shorten(to.owner.toString())}`;

  return {
    status,
    message,
    action: "Deposit",
    failed: SWAP_TRANSACTIONS_FAILED_STATUS.includes(status),
    details,
    tokens: tokenInfo ? [{ symbol: tokenInfo.symbol, tokenId: token.toString(), amount: amount.toString() }] : [],
  };
}
