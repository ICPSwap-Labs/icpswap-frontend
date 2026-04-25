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
    console.error(error);
  }

  content = `
GENERATE_SOURCEMAP=true
VITE_ENV="production"
VITE_IC_NETWORK="${network}"
VITE_SENTRY_ENABLED=true
VITE_SENTRY_DSN="${proEnvConfig.VITE_SENTRY_DSN}"
VITE_GOOGLE_TAG_MANAGER_ID="${proEnvConfig.VITE_GOOGLE_TAG_MANAGER_ID}"`;
} else if (network === "test") {
  content = `
GENERATE_SOURCEMAP=true
VITE_ENV="development"
VITE_IC_NETWORK="${network}"
VITE_SENTRY_ENABLED=false
VITE_SENTRY_DSN=""
VITE_GOOGLE_TAG_MANAGER_ID=""`;
} else {
  content = `
GENERATE_SOURCEMAP=true
VITE_ENV="development"
VITE_IC_NETWORK="${network}"
VITE_SENTRY_ENABLED=false
VITE_SENTRY_DSN=""
VITE_GOOGLE_TAG_MANAGER_ID=""`;
}

fs.writeFileSync(path.resolve(__dirname, "../.env"), content);
