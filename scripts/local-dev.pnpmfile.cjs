// Explicitly loaded by install:local; normal and production installs do not load this hook.
module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.name === "@icpswap/swap" && pkg.dependencies?.["@honopu/auth-client"]) {
        return {
          ...pkg,
          dependencies: {
            ...pkg.dependencies,
            "@honopu/auth-client": "npm:@dfinity/auth-client@2.1.2",
          },
        };
      }

      return pkg;
    },
  },
};
