import { configureStore } from "@reduxjs/toolkit";
import { AnyAction, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import sessionStorage from "redux-persist/lib/storage/session";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { PersistState } from "redux-persist/es/types";
import allReducer, { sessionReducer } from "./reducer";

import { AuthState } from "./auth/states";
import { SessionState } from "./session/states";
import { GlobalState } from "./global/states";
import { NFTTradeState } from "./NFTTrade/states";
import { SnackbarState } from "./snackbar/states";
import { LoadingState } from "./loadingReducer";
import { NFTState } from "./nft/states";
import { WalletState } from "./wallet/states";
import { CustomizationState } from "./customization/states";
import { SwapBurnState } from "./swap/burn/state";
import { SwapLiquidityState } from "./swap/liquidity/state";
import { SwapCacheState } from "./swap/cache/state";
import { SwapState } from "./swap/state";
import { TokenCacheState } from "./token/cache/states";
import { CallState } from "./call/states";
import { StepsState } from "./steps/state";
import { Web3State } from "./web3/states";
import { SnsState } from "./sns/states";
import { LimitOrderState } from "./swap/limit-order/state";
import { TransactionsState } from "./transactions/reducer";

import { SwapBurnState as SwapV2BurnState } from "./swapv2/burn/state";
import { SwapLiquidityState as SwapV2LiquidityState } from "./swapv2/liquidity/state";
import { SwapCacheState as SwapV2CacheState } from "./swapv2/cache/state";

interface PersistPartial {
  _persist: PersistState;
}
export interface AllState {
  auth: AuthState;
  session: SessionState & PersistPartial;
  global: GlobalState;
  loading: LoadingState;
  cache: any;
  snackbar: SnackbarState;
  swap: SwapState;
  swapLiquidity: SwapLiquidityState;
  swapBurn: SwapBurnState;
  swapCache: SwapCacheState;
  tokenCache: TokenCacheState;
  customization: CustomizationState;
  wallet: WalletState;
  nft: NFTState;
  NFTTrade: NFTTradeState;
  call: CallState;
  step: StepsState;
  swapV2Burn: SwapV2BurnState;
  swapV2Liquidity: SwapV2LiquidityState;
  swapV2Cache: SwapV2CacheState;
  web3: Web3State;
  sns: SnsState;
  transactions: TransactionsState;
  limitOrder: LimitOrderState;
}

const defaultStorageConfig = {
  storage,
  stateReconciler: autoMergeLevel2,
  version: 0,
};

const rootPersistConfig = {
  key: "root",
  ...defaultStorageConfig,
  blacklist: [
    "cache",
    "session",
    "global",
    "loading",
    "snackbar",
    "swap",
    "swapLiquidity",
    "swapBurn",
    "call",
    "step",
    "swapV2Liquidity",
    "swapV2Burn",
    "sns",
    "limitOrder",
  ],
  migrate: (state: any) => {
    let newState = {};

    if (state?._persist?.version === -1) {
      newState = { ...(state ?? {}), auth: {} };
    } else {
      newState = { ...(state ?? {}) };
    }

    // 11/17/2023 Fix some incorrect token cache
    if (state?._persist?.version === 1) {
      newState = { ...(state ?? {}), tokenCache: {} };
    } else {
      newState = { ...(state ?? {}) };
    }

    // 12/06/2023 Fix ckETH cache
    if (state?._persist?.version === 2) {
      newState = { ...(state ?? {}), tokenCache: {} };
    } else {
      newState = { ...(state ?? {}) };
    }

    return Promise.resolve(newState);
  },
  version: 3,
};

const SessionPersistConfig = {
  key: "session",
  storage: sessionStorage,
  stateReconciler: autoMergeLevel2,
  version: 3,
};

const rootReducer = combineReducers({
  ...allReducer,
  session: persistReducer<SessionState, AnyAction>(SessionPersistConfig, sessionReducer),
});

// @ts-ignore
const PersistReducer = persistReducer<AllState, AnyAction>(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer: PersistReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true, serializableCheck: false }),
});

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
