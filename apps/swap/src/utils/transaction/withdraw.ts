import type { WithdrawInfo } from "@icpswap/types";
import { parseTokenAmount, shorten } from "@icpswap/utils";
import { __getTokenInfo } from "hooks/token";
import { SWAP_TRANSACTIONS_FAILED_STATUS, type SwapTransactionResult } from "utils/transaction/constant";

export async function swapTransactionWithdrawFormat(info: WithdrawInfo): Promise<SwapTransactionResult> {
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
    action: "Withdraw",
    failed: SWAP_TRANSACTIONS_FAILED_STATUS.includes(status),
    details,
    tokens: tokenInfo ? [{ tokenId: token.toString(), amount: amount.toString(), symbol: tokenInfo.symbol }] : [],
  };
}
