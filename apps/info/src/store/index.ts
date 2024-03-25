import { configureStore } from "@reduxjs/toolkit";
import { AnyAction, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import allReducer from "./reducer";

import { GlobalState } from "./global/states";
import { TokenCacheState } from "./token/cache/states";
import { LoadingState } from "./loadingReducer";
import { CallState } from "./call/states";
import { SnackbarState } from "./snackbarReducer";

export interface AllState {
  global: GlobalState;
  tokenCache: TokenCacheState;
  loading: LoadingState;
  call: CallState;
  snackbar: SnackbarState;
}

const rootPersistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: ["global", "loading", "snackbar", "swap", "token"],
  migrate: (state: any) => {
    let newState = { _persist: state?._persist ?? {} };

    // 2023/12/06 Fix ckETH decimals upgrade
    if (state?._persist?.version === -1) {
      newState = { ...(state ?? {}), tokens: {} };
    } else {
      newState = { ...(state ?? {}) };
    }

    return Promise.resolve(newState);
  },
  version: 1,
};

const rootReducer = combineReducers({
  ...allReducer,
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
