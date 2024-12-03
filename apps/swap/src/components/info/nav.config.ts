import { t } from "@lingui/macro";

export type Route = {
  key: string;
  name: string;
  path: string;
  link?: string;
};

export const routes: Route[] = [
  {
    key: "info-overview",
    name: t`Overview`,
    path: "/info-overview",
  },
  {
    name: t`Swap`,
    path: "/info-swap",
    key: "info-swap",
  },
  {
    key: "info-tokens",
    name: t`Tokens`,
    path: "/info-tokens",
  },
  {
    key: "info-stake",
    name: t`Stake`,
    path: "/info-stake",
  },
  {
    key: "info-farm",
    name: t`Farm`,
    path: "/info-farm",
  },
  {
    key: "info-tools",
    name: t`Tools`,
    path: `/info-tools`,
  },
  {
    key: "info-marketplace",
    name: t`Marketplace`,
    path: `/info-marketplace`,
  },
  {
    key: "info-claim",
    name: t`Token Claim`,
    path: "/info-claim",
  },
  {
    key: "info-nfts",
    name: t`NFTs`,
    path: `/info-nfts`,
  },
  {
    key: "info-wrap",
    name: t`WICP`,
    path: "/info-wrap",
  },
];
