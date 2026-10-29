const path = require("node:path");
const fs = require("node:fs");
const { createHash } = require("node:crypto");
const { spawnSync } = require("node:child_process");

if ((process.env.CI && process.env.CI !== "false") || process.env.NODE_ENV === "production") {
  console.error(
    "install:local is only for local development. Use the normal authenticated install for CI and production.",
  );
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, "..");
const localDir = path.join(repoRoot, ".local-dev");
const hookPath = path.join(__dirname, "local-dev.pnpmfile.cjs");
const canonicalLockfile = fs.readFileSync(path.join(repoRoot, "pnpm-lock.yaml"), "utf8").replace(/\r\n/g, "\n");
const importersStart = canonicalLockfile.indexOf("\nimporters:\n");
const importersEnd = canonicalLockfile.indexOf("\npackages:\n", importersStart);
const publicAuthClient = canonicalLockfile.match(
  /      '@dfinity\/auth-client':\n        specifier: 2\.1\.2\n        version: ([^\n]+)/,
);

if (importersStart < 0 || importersEnd < 0 || !publicAuthClient) {
  throw new Error("Cannot prepare local dependencies: expected canonical pnpm v9 lockfile entries were not found.");
}

// Only importer paths and the private dependency alias change. Public snapshots stay locked.
let importers = canonicalLockfile.slice(importersStart, importersEnd);
const privateAuthClient = /      '@honopu\/auth-client':\n        specifier: [^\n]+\n        version: [^\n]+/g;
if (Array.from(importers.matchAll(privateAuthClient)).length !== 1) {
  throw new Error("Cannot prepare local dependencies: expected exactly one private auth-client dependency.");
}
importers = importers
  .replace(/^  (\S[^:\n]*):$/gm, (_, importer) => `  ${importer === "." ? ".." : `../${importer}`}:`)
  .replace(
    privateAuthClient,
    `      '@honopu/auth-client':\n        specifier: npm:@dfinity/auth-client@2.1.2\n        version: '@dfinity/auth-client@${publicAuthClient[1]}'`,
  );

const hookChecksum = `sha256-${createHash("sha256")
  .update(fs.readFileSync(hookPath, "utf8").replace(/\r\n/g, "\n"))
  .digest("base64")}`;
const lockfileHeader = canonicalLockfile.slice(0, importersStart).replace(/^pnpmfileChecksum:.*\n/gm, "");
const localLockfile = `${lockfileHeader}\npnpmfileChecksum: ${hookChecksum}\n${importers}${canonicalLockfile.slice(importersEnd)}`;

fs.mkdirSync(localDir, { recursive: true });
fs.writeFileSync(path.join(localDir, "pnpm-lock.yaml"), localLockfile);

// pnpm reads root resolution settings from lockfile-dir; retain the production settings.
const rootManifest = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
fs.writeFileSync(
  path.join(localDir, "package.json"),
  `${JSON.stringify({ private: true, resolutions: rootManifest.resolutions, pnpm: rootManifest.pnpm }, null, 2)}\n`,
);

if (process.argv[2] === "--prepare-only") {
  console.log("Prepared .local-dev/pnpm-lock.yaml; canonical pnpm-lock.yaml unchanged.");
  process.exit(0);
}

console.log(
  "Local development install: using public @dfinity/auth-client@2.1.2 instead of the private auth-client fork.",
);
console.log(
  "Public dependency versions stay frozen to the canonical lockfile; production manifests and lockfile remain unchanged.",
);
console.log("Wallet sign-in with this substitution is unverified.");

const result = spawnSync(
  process.platform === "win32" ? "corepack.cmd" : "corepack",
  ["pnpm@10.15.1", "install", "--pnpmfile", hookPath, "--lockfile-dir", localDir, "--frozen-lockfile"],
  { cwd: repoRoot, stdio: "inherit" },
);

if (result.error) {
  console.error(result.error.message);
}

process.exitCode = result.status ?? 1;
