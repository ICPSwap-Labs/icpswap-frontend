import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import checker from "vite-plugin-checker";
import oxlint from "vite-plugin-oxlint";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

export default defineConfig(() => {
  return {
    preview: {
      port: "3003",
    },
    server: {
      port: "3000",
    },
    optimizeDeps: {
      include: ["echarts"],
    },
    build: {
      outDir: "build",
      rollupOptions: {
        output: {
          manualChunks: {
            framework: ["react", "react-router-dom", "react-dom"],
            utils: ["bignumber.js", "dayjs", "lodash", "jsbi"],
            ui: ["@mui/material", "@mui/lab", "@mui/base", "@mui/icons-material", "@mui/styles", "react-feather"],
            web3: [
              "@fort-major/msq-client",
              "wagmi",
              "web3",
              "@ethersproject/abi",
              "@ethersproject/address",
              "@ethersproject/bignumber",
              "@ethersproject/constants",
              "@ethersproject/contracts",
              "@ethersproject/providers",
            ],
            dfinity_wallet: [
              "@nfid/identitykit",
              "ic-stoic-identity",
              "@honopu/auth-client",
              "@astrox/sdk-web",
              "@astrox/sdk-webview",
            ],
            charts: ["recharts", "echarts", "lightweight-charts"],
          },
        },
      },
    },
    plugins: [
      analyzer({ analyzerMode: "static" }),
      react(),
      checker({
        typescript: {
          root: __dirname,
          tsconfigPath: "tsconfig.json",
        },
        terminal: true,
      }),
      tsconfigPaths(),
      svgr({
        svgrOptions: {
          icon: false,
          ref: true,
          titleProp: true,
          exportType: "named",
          svgo: true,
          svgoConfig: {
            plugins: [
              {
                name: "preset-default",
                params: {
                  overrides: { removeViewBox: false },
                },
              },
              "removeDimensions",
            ],
          },
        },
        include: "**/*.svg",
      }),
      {
        name: "svg-import-fix",
        transform(code) {
          const regex = /import\s+([a-zA-Z0-9_$]+)\s+from\s+['"]([^'"]+\.svg)['"]/g;

          // eslint-disable-next-line max-params
          const transformed = code.replace(regex, (match, varName, path) => {
            // Don't touch named imports like { ReactComponent }
            if (match.includes("{")) return match;
            // Skip if it already has a query param
            if (path.includes("?")) return match;

            return `import ${varName} from '${path}?url'`;
          });

          return transformed === code ? null : transformed;
        },
      },
      oxlint({
        path: path.join(__dirname, "src"),
        configFile: path.join(repoRoot, ".oxlintrc.json"),
        failOnError: false,
        failOnWarning: false,
        lintOnStart: true,
      }),
    ],
  };
});
