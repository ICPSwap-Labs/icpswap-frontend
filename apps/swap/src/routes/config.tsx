import { lazy } from "react";
import Loadable from "components/Loading/Loadable";

import { infoRoutes } from "./info.config";
import { nnsRoutes } from "./nns.config";
import { nftRoutes } from "./nft.config";
import { swapRoutes } from "./swap.config";
import { farmRoutes } from "./farm.config";
import { stakeRoutes } from "./stake.config";
import { votingRoutes } from "./voting.config";
import { claimRoutes } from "./claim.config";
import { RouteDefinition } from "./type";

const Wallet = Loadable(lazy(() => import("../views/wallet/index")));
const NFTMint = Loadable(lazy(() => import("../views/nft/Mint")));
const NFTCanisterList = Loadable(lazy(() => import("../views/nft/CanisterList")));
const NFTCanisterCreate = Loadable(lazy(() => import("../views/nft/CanisterCreate")));
const CkBridge = Loadable(lazy(() => import("../views/ck-bridge")));

export const routeConfigs: RouteDefinition[] = [
  { path: "/wallet", getElement: () => <Wallet /> },
  { path: "/info-tools/nft/canister/create", getElement: () => <NFTCanisterCreate /> },
  { path: "/info-tools/nft/mint", getElement: () => <NFTMint /> },
  { path: "/info-tools/nft/canister/list", getElement: () => <NFTCanisterList /> },
  { path: "/ck-bridge", getElement: () => <CkBridge /> },

  ...infoRoutes,
  ...stakeRoutes,
  ...farmRoutes,
  ...nftRoutes,
  ...nnsRoutes,
  ...swapRoutes,
  ...votingRoutes,
  ...claimRoutes,
];
