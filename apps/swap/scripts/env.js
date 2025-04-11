const fs = require("fs");
const path = require("path");
const network = process.argv[2] ?? "ic";

let content = "";

if (network === "ic") {
  const proEnvConfig = require("./env.config.pro.json");

  content = `
EXTEND_ESLINT=true
GENERATE_SOURCEMAP=true
REACT_ENV="production"
REACT_APP_ENV="production"
REACT_APP_IC_NETWORK="ic"
REACT_APP_SENTRY_ENABLED=true
REACT_APP_SENTRY_DSN="${proEnvConfig.REACT_APP_SENTRY_DSN}"
REACT_APP_GOOGLE_TAG_MANAGER_ID="${proEnvConfig.REACT_APP_GOOGLE_TAG_MANAGER_ID}"`;
} else if (network === "test") {
  content = `
EXTEND_ESLINT=true
GENERATE_SOURCEMAP=true
REACT_ENV="development"
REACT_APP_ENV="development"
REACT_APP_IC_NETWORK="test"
REACT_APP_SENTRY_ENABLED=false
REACT_APP_SENTRY_DSN=""
REACT_APP_GOOGLE_TAG_MANAGER_ID=""`;
} else {
  content = `
EXTEND_ESLINT=true
GENERATE_SOURCEMAP=true
REACT_ENV="development"
REACT_APP_ENV="development"
REACT_APP_IC_NETWORK="local"
REACT_APP_SENTRY_ENABLED=false
REACT_APP_SENTRY_DSN=""
REACT_APP_GOOGLE_TAG_MANAGER_ID=""`;
}

fs.writeFileSync(path.resolve(__dirname, "../.env"), content);
