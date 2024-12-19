export type Route = {
  key: string;
  name: string;
  path: string;
  link?: string;
};

export const routes: Route[] = [
  {
    key: "info-overview",
    name: "Overview",
    path: "/info-overview",
  },
  {
    name: "Swap",
    path: "/info-swap",
    key: "info-swap",
  },
  {
    key: "info-tokens",
    name: "Tokens",
    path: "/info-tokens",
  },
  {
    key: "info-stake",
    name: "Stake",
    path: "/info-stake",
  },
  {
    key: "info-farm",
    name: "Farm",
    path: "/info-farm",
  },
  {
    key: "info-tools",
    name: "Tools",
    path: `/info-tools`,
  },
  {
    key: "info-claim",
    name: "Token Claim",
    path: "/info-claim",
  },
  {
    key: "info-nfts",
    name: "NFTs",
    path: `/info-nfts`,
  },
  {
    key: "info-wrap",
    name: "WICP",
    path: "/info-wrap",
  },
];
