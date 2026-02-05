import { type ViteUserConfig } from "vitest/config";

export const baseConfig: ViteUserConfig = {
  test: {
    globals: true,
    watch: false,
    exclude: ["tests/integration/**", "node_modules/**", "dist/** "],
  },
};
