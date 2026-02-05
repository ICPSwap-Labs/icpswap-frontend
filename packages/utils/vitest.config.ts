import { defineConfig } from "vitest/config";
import { baseConfig } from "@icpswap/vitest-config";

export default defineConfig({
  test: {
    ...baseConfig.test,
    exclude: ["node_modules/**", "dist/**"],
  },
});
