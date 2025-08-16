import { AddLiquidityInfo } from "@icpswap/types";
import { __getTokenInfo } from "hooks/token";
import { parseTokenAmount } from "@icpswap/utils";
import { SwapTransactionResult, SWAP_TRANSACTIONS_FAILED_STATUS } from "utils/transaction/constant";

export async function swapTransactionAddLiquidityFormat(info: AddLiquidityInfo): Promise<SwapTransactionResult> {
  const __status = info.status;
  const message = info.err[0];
  const status = Object.keys(__status)[0];

  const { positionId, amount0, amount1, token0, token1 } = info;
  const token0Info = await __getTokenInfo(token0.toString());
  const token1Info = await __getTokenInfo(token1.toString());

  const details =
    !token0Info || !token1Info
      ? "No token info, please reload the page"
      : `Add ${parseTokenAmount(amount0, token0Info.decimals).toFormat()} ${token0Info.symbol} and ${parseTokenAmount(
          amount1,
          token1Info.decimals,
        ).toFormat()} ${token1Info.symbol}, position id: ${positionId.toString()}`;

  return {
    status,
    message,
    action: "AddLiquidity",
    failed: SWAP_TRANSACTIONS_FAILED_STATUS.includes(status),
    details,
    tokens:
      token0Info && token1Info
        ? [
            {
              tokenId: token0.address.toString(),
              symbol: token0Info.symbol,
              amount: amount0.toString(),
            },
            {
              tokenId: token1.address.toString(),
              symbol: token1Info.symbol,
              amount: amount1.toString(),
            },
          ]
        : [],
  };
}
