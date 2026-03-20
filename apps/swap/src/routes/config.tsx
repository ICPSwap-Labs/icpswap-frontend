import Loadable from "components/Loading/Loadable";
import i18n from "i18n";
import { lazy } from "react";
import { claimRoutes } from "./claim.config";
import { farmRoutes } from "./farm.config";
import { infoRoutes } from "./info.config";
import { nftRoutes } from "./nft.config";
import { nnsRoutes } from "./nns.config";
import { stakeRoutes } from "./stake.config";
import { swapRoutes } from "./swap.config";
import type { RouteDefinition } from "./type";

const StaticTitlesAndDescriptions = {
  CkBridge: i18n.t("title.ck-bridge"),
};

const NFTMint = Loadable(lazy(() => import("../views/nft/Mint")));
const NFTCanisterList = Loadable(lazy(() => import("../views/nft/CanisterList")));
const NFTCanisterCreate = Loadable(lazy(() => import("../views/nft/CanisterCreate")));
const CkBridge = Loadable(lazy(() => import("../views/ck-bridge")));

export const routeConfigs: RouteDefinition[] = [
  { path: "/info-tools/nft/canister/create", getElement: () => <NFTCanisterCreate /> },
  { path: "/info-tools/nft/mint", getElement: () => <NFTMint /> },
  { path: "/info-tools/nft/canister/list", getElement: () => <NFTCanisterList /> },
  { path: "/ck-bridge", getElement: () => <CkBridge />, getTitle: () => StaticTitlesAndDescriptions.CkBridge },

  ...infoRoutes,
  ...stakeRoutes,
  ...farmRoutes,
  ...nftRoutes,
  ...nnsRoutes,
  ...swapRoutes,
  ...claimRoutes,
];
