import customizationReducer from "./customization/reducer";
import snackbarReducer from "./snackbar/reducer";
import walletReducer from "./wallet/reducer";
import globalReducer from "./global/reducer";
import loadingReducer from "./loadingReducer";
import SwapReducer from "./swap/reducer";
import SwapLiquidityReducer from "./swap/liquidity/reducer";
import SwapCacheReducer from "./swap/cache/reducer";
import SwapBurn from "./swap/burn/reducer";
import NFTReducer from "./nft/reducer";
import AuthReducer from "./auth/reducer";
import sessionReducer from "./session/reducer";
import tokenCacheReducer from "./token/cache/reducer";
import callReducer from "./call/reducer";
import StepReducer from "./steps/reducer";
import SnsReducer from "./sns/reducer";
import TransactionsReducer from "./transactions/reducer";

import SwapV2LiquidityReducer from "./swapv2/liquidity/reducer";
import SwapV2CacheReducer from "./swapv2/cache/reducer";
import SwapV2Burn from "./swapv2/burn/reducer";
import Web3 from "./web3/reducer";

export { sessionReducer };

export default {
  customization: customizationReducer,
  snackbar: snackbarReducer,
  loading: loadingReducer,
  wallet: walletReducer,
  global: globalReducer,
  swap: SwapReducer,
  swapCache: SwapCacheReducer,
  swapLiquidity: SwapLiquidityReducer,
  swapBurn: SwapBurn,
  nft: NFTReducer,
  auth: AuthReducer,
  call: callReducer,
  step: StepReducer,
  tokenCache: tokenCacheReducer,
  transactions: TransactionsReducer,

  swapV2Cache: SwapV2CacheReducer,
  swapV2Liquidity: SwapV2LiquidityReducer,
  swapV2Burn: SwapV2Burn,
  web3: Web3,
  sns: SnsReducer,
};
