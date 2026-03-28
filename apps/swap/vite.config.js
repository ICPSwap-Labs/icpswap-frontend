import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import biome from "vite-plugin-biome";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  return {
    preview: {
      port: "3003",
    },
    server: {
      port: "3000",
    },
    build: {
      outDir: "build",
      rollupOptions: {
        output: {
          manualChunks: {
            framework: ["react", "react-router-dom", "react-dom"],
            utils: ["bignumber.js", "dayjs", "lodash", "jsbi"],
            wagmi: ["wagmi"],
            recharts: ["recharts"],
          },
        },
      },
    },
    plugins: [
      analyzer({ analyzerMode: "static" }),
      react(),
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
      biome({
        check: {
          enabled: true,
          target: "src/**/*",
          severity: "error",
        },
        format: { enabled: false },
      }),
    ],
  };
});
