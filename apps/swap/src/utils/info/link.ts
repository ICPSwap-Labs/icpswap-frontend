import { FeeAmount } from "@icpswap/swap-sdk";
import { ICP_TOKEN_INFO, WRAPPED_ICP_TOKEN_INFO } from "@icpswap/tokens";

export function swapLink(canisterId: string) {
  if (canisterId === ICP_TOKEN_INFO.canisterId || canisterId === WRAPPED_ICP_TOKEN_INFO.canisterId)
    return `/swap?input=${ICP_TOKEN_INFO.canisterId}`;
  return `/swap?input=${ICP_TOKEN_INFO.canisterId}&output=${canisterId}`;
}

export function addLiquidityLinkWithICP(canisterId: string, fee = FeeAmount.MEDIUM) {
  if (canisterId === ICP_TOKEN_INFO.canisterId || canisterId === WRAPPED_ICP_TOKEN_INFO.canisterId)
    return `/liquidity/add/${ICP_TOKEN_INFO.canisterId}/`;
  return `/liquidity/add/${ICP_TOKEN_INFO.canisterId}/${canisterId}/${fee}`;
}

export function swapLinkOfPool(token0Id: string, token1Id: string) {
  return `/swap?input=${token0Id}&output=${token1Id}`;
}
