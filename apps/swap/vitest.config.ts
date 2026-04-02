import { baseConfig } from "@icpswap/vitest-config";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    ...baseConfig.test,
    exclude: ["node_modules/**", "dist/**"],
  },
});
