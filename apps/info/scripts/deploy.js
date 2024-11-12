const shelljs = require("shelljs");
const path = require("path");

const identity = process.argv[2];
const network = process.argv[3] ?? "ic";

function deploy() {
  const pre_deploy_path = path.resolve(__dirname, "./pre-deploy.js");
  shelljs.exec(`node ${pre_deploy_path}`);

  const use_identity_result = shelljs.exec(`dfx identity use ${identity}`);

  if (use_identity_result.code !== 0) {
    console.log("Invalid identity.");
    return;
  }

  const result = shelljs.exec(`dfx deploy --network=${network} --wallet=$(dfx identity --network=ic get-wallet)`);

  if (result.code !== 0) {
    deploy();
  }
}

if (!identity) {
  console.error("No identity");
} else {
  deploy();
}
