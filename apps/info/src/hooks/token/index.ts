import { WRAPPED_ICP_TOKEN_INFO } from "constants/tokens";
import store from "store/index";

export function getSwapTokenArgs(address: string) {
  const { standards } = store.getState().tokenCache;
  let standard = standards[address] as string;
  if (address === WRAPPED_ICP_TOKEN_INFO.canisterId) standard = WRAPPED_ICP_TOKEN_INFO.standardType;
  if (!standard) throw Error(`No token standard: ${address}`);
  return { address, standard: standard as string };
}

export * from "./useTokenBalance";
export * from "./useTokens";
export * from "./useTokenInfo";
