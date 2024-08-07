import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

import * as serviceWorker from "./serviceWorker";
import App from "./App";
import store, { persistor } from "./store";
import { LanguageProvider } from "./i18n";

import "./assets/css/global.css";

window.onerror = (msg, url, row, col, error) => {
  let _error = "";

  if (error) {
    _error = error.toString();
  }

  console.error(msg, url, row, col, error, "msg, row, col, error");
  // update users not reload error debug
  if (/Loading chunk *.{1,} failed./.test(_error) || /Unexpected token '<'/.test(_error)) {
    window.location.reload();
  }
};

const root = document.getElementById("root") as HTMLElement;

createRoot(root).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
