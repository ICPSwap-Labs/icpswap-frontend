/* eslint-disable global-require */

import i18n from "i18next";

// note: not using isInterface here for tree shaking
if (!process.env.REACT_APP_IS_INTERFACE) {
  require("./i18n-setup");
}

export { changeLanguage } from "./changeLanguage";

export default i18n;
