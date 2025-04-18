const fs = require("fs");
const path = require("path");
const env = process.argv[2] ?? "dev";
const network = process.argv[3] ?? "ic";

let content = "";

const isPro = env === "pro";

if (network === "ic" && isPro === true) {
  let proEnvConfig = {};

  try {
    proEnvConfig = require("./env.config.pro.json");
  } catch (error) {
    // Do nothing
  }

  content = `
EXTEND_ESLINT=true
GENERATE_SOURCEMAP=true
REACT_ENV="production"
REACT_APP_ENV="production"
REACT_APP_IC_NETWORK="${network}"
REACT_APP_SENTRY_ENABLED=true
REACT_APP_SENTRY_DSN="${proEnvConfig.REACT_APP_SENTRY_DSN}"
REACT_APP_GOOGLE_TAG_MANAGER_ID="${proEnvConfig.REACT_APP_GOOGLE_TAG_MANAGER_ID}"`;
} else if (network === "test") {
  content = `
EXTEND_ESLINT=true
GENERATE_SOURCEMAP=true
REACT_ENV="development"
REACT_APP_ENV="development"
REACT_APP_IC_NETWORK="${network}"
REACT_APP_SENTRY_ENABLED=false
REACT_APP_SENTRY_DSN=""
REACT_APP_GOOGLE_TAG_MANAGER_ID=""`;
} else {
  content = `
EXTEND_ESLINT=true
GENERATE_SOURCEMAP=truew
REACT_ENV="development"
REACT_APP_ENV="development"
REACT_APP_IC_NETWORK="${network}"
REACT_APP_SENTRY_ENABLED=false
REACT_APP_SENTRY_DSN=""
REACT_APP_GOOGLE_TAG_MANAGER_ID=""`;
}

fs.writeFileSync(path.resolve(__dirname, "../.env"), content);
