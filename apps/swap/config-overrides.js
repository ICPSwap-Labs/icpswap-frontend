const {
  override,
  addWebpackAlias,
  useBabelRc,
  addWebpackPlugin,
  removeModuleScopePlugin,
  overrideDevServer,
} = require("customize-cra");
const path = require("path");
const webpack = require("webpack");

const aliases = {
  buffer: path.resolve(__dirname, "./node_modules/buffer"),
  process: "process/browser.js",
  components: path.resolve(__dirname, "./src/components"),
  store: path.resolve(__dirname, "./src/store"),
  constants: path.resolve(__dirname, "./src/constants"),
  assets: path.resolve(__dirname, "./src/assets"),
  hooks: path.resolve(__dirname, "./src/hooks"),
  utils: path.resolve(__dirname, "./src/utils"),
  declaration: path.resolve(__dirname, "./src/declaration"),
};

const addProxy = () => (configFunction) => {
  configFunction.proxy = {
    "/api": {
      target: "http://localhost:8000",
      changeOrigin: true,
    },
    "/dfx_image": {
      target: "http://localhost:8000",
      changeOrigin: true,
      pathRewrite: {
        "^/dfx_image": "",
      },
    },
  };

  return configFunction;
};

module.exports = {
  webpack: function (config, dev) {
    const fn = override(
      removeModuleScopePlugin(),
      addWebpackAlias(aliases),
      useBabelRc(),
      addWebpackPlugin(
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser.js",
        })
      )
    );

    return {
      ...fn(config),
      // for safari mobile debug
      // devtool: dev === "development" ? "cheap-module-eval-source-map" : false,
    };
  },
  devServer: overrideDevServer(addProxy()),
};
