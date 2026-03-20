import AuthReducer from "./auth/reducer";
import callReducer from "./call/reducer";
import customizationReducer from "./customization/reducer";
import globalReducer from "./global/reducer";
import loadingReducer from "./loadingReducer";
import NFTReducer from "./nft/reducer";
import PriceAlertsReducer from "./price-alerts/reducer";
import sessionReducer from "./session/reducer";
import SnsReducer from "./sns/reducer";
import StepReducer from "./steps/reducer";
import SwapBurn from "./swap/burn/reducer";
import SwapCacheReducer from "./swap/cache/reducer";
import LimitOrderReducer from "./swap/limit-order/reducer";
import SwapLiquidityReducer from "./swap/liquidity/reducer";
import SwapReducer from "./swap/reducer";
import tokenCacheReducer from "./token/cache/reducer";
import TransactionsReducer from "./transactions/reducer";
import walletReducer from "./wallet/reducer";
import Web3 from "./web3/reducer";

export { sessionReducer };

export default {
  customization: customizationReducer,
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
  limitOrder: LimitOrderReducer,
  web3: Web3,
  sns: SnsReducer,
  priceAlerts: PriceAlertsReducer,
};
