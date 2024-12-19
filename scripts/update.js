const shelljs = require("shelljs");
const packageJson = require("../package.json");

const level = process.argv[2] ?? "c";

const curr_version = packageJson.version;

let [a, b, c] = curr_version.split(".");

if (level == "a") {
  a = Number(a) + 1;
  b = 0;
  c = 0;
} else if (level == "b") {
  b = Number(b) + 1;
  c = 0;
} else {
  c = Number(c) + 1;
}

const new_version = `${a}.${b}.${c}`;

console.log("new version: ", new_version);

shelljs.exec(`npm version ${new_version}`);
shelljs.exec(`git push`);
shelljs.exec(`git tag -d v${new_version}`);
shelljs.exec(`git tag -a v${new_version} -m "${new_version}"`);
shelljs.exec(`git push origin v${new_version}`);
