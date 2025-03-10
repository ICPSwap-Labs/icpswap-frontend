const fs = require("fs");
const path = require("path");

const packageJSON = fs.readFileSync(path.resolve(__dirname, "../package.json"), {
  encoding: "utf8",
});
const json = JSON.parse(packageJSON);
const version = json.version;

const content = `
/** This is auto generated by scripts/prepare.js */

export const version: string = "${version}"
`;

fs.writeFile(path.resolve(__dirname, "../apps/swap/src/.version.ts"), content, (err) => {
  console.log(err);
});

const swapCanisterIdsPath = path.resolve(__dirname, "../apps/swap/src/temp_canister_ids.json");

fs.access(swapCanisterIdsPath, fs.constants.F_OK, (err) => {
  if (err) {
    fs.writeFile(swapCanisterIdsPath, `{}`, (err) => {
      console.log(err);
    });
  }
});
