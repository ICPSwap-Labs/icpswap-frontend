import { getStorageTokenInfo } from "hooks/token";
import { SwapInfo } from "@icpswap/types";
import { parseTokenAmount } from "@icpswap/utils";
import { SwapTransactionResult, SWAP_TRANSACTIONS_FAILED_STATUS } from "utils/transaction/constant";

export async function swapTransactionSwapFormat(info: SwapInfo): Promise<SwapTransactionResult> {
  const __status = info.status;
  const message = info.err[0];
  const status = Object.keys(__status)[0];

  const { tokenIn, tokenOut, amountIn, amountOut } = info;
  const tokenInInfo = await getStorageTokenInfo(tokenIn.toString());
  const tokenOutInfo = await getStorageTokenInfo(tokenOut.toString());

  const details =
    !tokenInInfo || !tokenOutInfo
      ? "No token info, please reload the page"
      : `Swap ${parseTokenAmount(amountIn, tokenInInfo.decimals).toFormat()} ${
          tokenInInfo.symbol
        } to ${parseTokenAmount(amountOut, tokenOutInfo.decimals).toFormat()} ${tokenOutInfo.symbol}`;

  return {
    status,
    message,
    action: "Swap",
    failed: SWAP_TRANSACTIONS_FAILED_STATUS.includes(status),
    details,
    tokens:
      tokenInInfo && tokenOutInfo
        ? [
            { tokenId: tokenIn.address.toString(), amount: amountIn.toString(), symbol: tokenInInfo.symbol },
            { tokenId: tokenOut.address.toString(), amount: amountOut.toString(), symbol: tokenOutInfo.symbol },
          ]
        : [],
  };
}
