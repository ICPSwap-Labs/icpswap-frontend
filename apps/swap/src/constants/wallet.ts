import { ICP, WRAPPED_ICP, ICS, ckUSDC, ckBTC, ckETH } from "@icpswap/tokens";

export { Connector } from "@icpswap/actor";

export const DISPLAY_IN_WALLET_FOREVER = [
  ICP.address,
  WRAPPED_ICP.address,
  ICS.address,
  ckUSDC.address,
  ckBTC.address,
  ckETH.address,
];

export const NO_HIDDEN_TOKENS = [ICP.address, WRAPPED_ICP.address];

export const DEFAULT_DISPLAYED_TOKENS = [ICP, ICS, ckUSDC, ckBTC, ckETH];
