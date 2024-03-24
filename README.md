![](https://raw.githubusercontent.com/ICPSwap-Labs/icpswap-frontend/main/apps/swap/public/og_image.png)

# ICPSwap

## Development Quick Start

Ensure you have

- [Node.js](https://nodejs.org) 18 or later installed
- [Pnpm](https://pnpm.io/) v8 installed
- ts-node installed(npm i -g ts-node)

You need a **personal access token** to install some of our npm packages.

The token must have the `repo` and `read:packages` scopes to login to the [GitHub Package Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

If you don't have one, create the personal access token [in the developer settings](https://github.com/settings/tokens).

Run the following command to authenticate, using the **personal access token** as your **password**:

```
npm login --registry=https://npm.pkg.github.com --scope=@honopu
```

Then run the following:

- `pnpm i` to install dependencies.
- `pnpm run dev` to start the development server
- `pnpm run build` to build
