import { createConfig, fallback, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: fallback([
      http("https://cloudflare-eth.com"),
      http("https://rpc.ankr.com/eth"),
      http("https://1rpc.io/eth"),
      http("https://ethereum.publicnode.com"),
    ]),
    [sepolia.id]: http(),
  },
  connectors: [injected()],
});
