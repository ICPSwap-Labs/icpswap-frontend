import snackbarReducer from "./snackbarReducer";
import globalReducer from "./global/reducer";
import loadingReducer from "./loadingReducer";
import tokenCacheReducer from "./token/cache/reducer";
import callReducer from "./call/reducer";
import snsReducer from "./sns/reducer"

export { tokenCacheReducer };

export default {
  snackbar: snackbarReducer,
  loading: loadingReducer,
  global: globalReducer,
  call: callReducer,
  tokenCache: tokenCacheReducer,
  sns:snsReducer
};
