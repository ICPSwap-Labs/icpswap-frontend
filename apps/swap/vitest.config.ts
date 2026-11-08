import { baseConfig } from "@icpswap/vitest-config";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Resolve the app's `baseUrl: "src"` imports (e.g. `constants/misc`) the same way vite does.
  plugins: [tsconfigPaths()],
  test: {
    ...baseConfig.test,
    exclude: ["node_modules/**", "dist/**"],
  },
});
