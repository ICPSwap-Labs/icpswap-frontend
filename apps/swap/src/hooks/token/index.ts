import { WRAPPED_ICP_TOKEN_INFO } from "constants/index";
import store from "store/index";
import { ICP_TOKEN_INFO } from "@icpswap/tokens";

export function getSwapTokenArgs(token: string) {
  const { standards } = store.getState().tokenCache;
  let standard = standards[token];
  if (token === WRAPPED_ICP_TOKEN_INFO.canisterId) standard = WRAPPED_ICP_TOKEN_INFO.standardType;
  if (token === ICP_TOKEN_INFO.canisterId) standard = ICP_TOKEN_INFO.standardType;
  if (!standard) throw Error(`No token standard: ${token}, please reload the page`);
  return { address: token, standard: standard as string };
}

export * from "./useAllowance";
export * from "./useApprove";
export * from "./useTokenInfo";
export * from "./useTokenBalance";
export * from "./useTokenInSNS";
export * from "./useERC20Token";
