import { configureStore } from "@reduxjs/toolkit";
import { type AnyAction, combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import type { PersistState } from "redux-persist/es/types";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";
import sessionStorage from "redux-persist/lib/storage/session";
import type { AuthState } from "./auth/states";
import type { CallState } from "./call/states";
import type { CustomizationState } from "./customization/states";
import type { GlobalState } from "./global/states";
import type { LoadingState } from "./loadingReducer";
import type { NFTTradeState } from "./NFTTrade/states";
import type { NFTState } from "./nft/states";
import type { PriceAlertsState } from "./price-alerts/states";
import allReducer, { sessionReducer } from "./reducer";
import type { SessionState } from "./session/states";
import type { SnsState } from "./sns/states";
import type { StepsState } from "./steps/state";
import type { SwapBurnState } from "./swap/burn/state";
import type { SwapCacheState } from "./swap/cache/state";
import type { LimitOrderState } from "./swap/limit-order/state";
import type { SwapLiquidityState } from "./swap/liquidity/state";
import type { SwapState } from "./swap/state";
import type { TokenCacheState } from "./token/cache/states";
import type { TransactionsState } from "./transactions/reducer";
import type { WalletState } from "./wallet/states";
import type { Web3State } from "./web3/states";

interface PersistPartial {
  _persist: PersistState;
}
export interface AllState {
  auth: AuthState;
  session: SessionState & PersistPartial;
  global: GlobalState;
  loading: LoadingState;
  cache: any;
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
  web3: Web3State;
  sns: SnsState;
  transactions: TransactionsState;
  limitOrder: LimitOrderState;
  priceAlerts: PriceAlertsState;
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

    // Reset the multipleApprove to 1000
    if (state?._persist?.version === 3) {
      if (state) {
        newState = { ...state, swapCache: { ...(state.swapCache ?? {}), multipleApprove: 1000 } };
      }
    } else {
      newState = { ...(state ?? {}) };
    }

    return Promise.resolve(newState);
  },
  version: 4,
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

// @ts-expect-error
const PersistReducer = persistReducer<AllState, AnyAction>(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer: PersistReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true, serializableCheck: false }),
});

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
