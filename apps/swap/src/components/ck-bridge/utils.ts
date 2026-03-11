import { Token } from "@icpswap/swap-sdk";
import { BridgeChainType } from "@icpswap/constants";
import { ckBTC, ckDoge, ckETH } from "@icpswap/tokens";

function getBridgeChainByAddress(address: string): BridgeChainType {
  if (address === ckDoge.address) return BridgeChainType.doge;
  if (address === ckBTC.address) return BridgeChainType.btc;
  if (address === ckETH.address) return BridgeChainType.eth;
  return BridgeChainType.erc20;
}

export function getBridgeChainByToken(token: Token): BridgeChainType {
  return getBridgeChainByAddress(token.address);
}

export function getBridgeChainByTokenId(address: string): BridgeChainType {
  return getBridgeChainByAddress(address);
}
