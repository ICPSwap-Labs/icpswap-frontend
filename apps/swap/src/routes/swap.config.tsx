import { lazy } from "react";
import Loadable from "components/Loading/Loadable";
import i18n from "i18n";

import { RouteDefinition } from "./type";

const Swap = Loadable(lazy(() => import("../views/swap-liquidity-v3/index")));
const SwapLimit = Loadable(lazy(() => import("../views/swap-liquidity-v3/limit")));
const SwapPro = Loadable(lazy(() => import("../views/swap-pro")));
const Liquidity = Loadable(lazy(() => import("../views/swap-liquidity-v3/liquidity/index")));
const AddLiquidity = Loadable(lazy(() => import("../views/swap-liquidity-v3/liquidity/AddLiquidity")));
const IncreaseLiquidity = Loadable(lazy(() => import("../views/swap-liquidity-v3/liquidity/IncreaseLiquidity")));
const DecreaseLiquidity = Loadable(lazy(() => import("../views/swap-liquidity-v3/liquidity/decrease")));
const SwapReclaim = Loadable(lazy(() => import("../views/swap-liquidity-v3/reclaim/Reclaim")));
const SwapFindMisTransferToken = Loadable(lazy(() => import("../views/swap-liquidity-v3/MisTransferTokens")));
const SwapRevokeApprove = Loadable(lazy(() => import("../views/swap-liquidity-v3/RevokeApprove")));
const PCMReclaim = Loadable(lazy(() => import("../views/swap-liquidity-v3/PCMReclaim")));
const Position = Loadable(lazy(() => import("../views/swap-liquidity-v3/liquidity/Position")));

const StaticTitlesAndDescriptions = {
  Swap: i18n.t("title.swap"),
  Limit: i18n.t("title.limit"),
  Liquidity: i18n.t("title.liquidity"),
  Swap_pro: i18n.t("title.swap.pro"),
};

export const swapRoutesConfigs = {
  SWAP: "/swap",
  SWAP_LIMIT: "/swap/limit",
  SWAP_RECLAIM: "/swap/withdraw",
  SWAP_REVOKE: "/swap/revoke-approve",
  SWAP_PRO: "/swap/pro",
  SWAP_PCM_RECLAIM: "/swap/pcm/reclaim",
  SWAP_MIS_TRANSFER: "/swap/find-mis-transferred-token",

  LIQUIDITY: "/liquidity",
  LIQUIDITY_ADD: "/liquidity/add/:currencyIdA?/:currencyIdB?/:feeAmount?",
  LIQUIDITY_DECREASE: "/liquidity/decrease/:positionId/:pool",
  LIQUIDITY_INCREASE: "/liquidity/increase/:positionId/:pool",
  LIQUIDITY_POSITION: "/liquidity/position/:positionId/:pool",
};

export const swapRoutes: RouteDefinition[] = [
  { path: "/", getElement: () => <Swap />, getTitle: () => StaticTitlesAndDescriptions.Swap },
  { path: swapRoutesConfigs.SWAP, getElement: () => <Swap />, getTitle: () => StaticTitlesAndDescriptions.Swap },
  {
    path: swapRoutesConfigs.SWAP_LIMIT,
    getElement: () => <SwapLimit />,
    getTitle: () => StaticTitlesAndDescriptions.Limit,
  },
  {
    path: swapRoutesConfigs.SWAP_RECLAIM,
    getElement: () => <SwapReclaim />,
    getTitle: () => StaticTitlesAndDescriptions.Swap,
  },
  {
    path: swapRoutesConfigs.SWAP_MIS_TRANSFER,
    getElement: () => <SwapFindMisTransferToken />,
    getTitle: () => StaticTitlesAndDescriptions.Swap,
  },
  {
    path: swapRoutesConfigs.SWAP_REVOKE,
    getElement: () => <SwapRevokeApprove />,
    getTitle: () => StaticTitlesAndDescriptions.Swap,
  },
  {
    path: swapRoutesConfigs.SWAP_PCM_RECLAIM,
    getElement: () => <PCMReclaim />,
    getTitle: () => StaticTitlesAndDescriptions.Swap,
  },
  {
    path: swapRoutesConfigs.SWAP_PRO,
    getElement: () => <SwapPro />,
    getTitle: () => StaticTitlesAndDescriptions.Swap_pro,
  },
  {
    path: swapRoutesConfigs.LIQUIDITY,
    getElement: () => <Liquidity />,
    getTitle: () => StaticTitlesAndDescriptions.Liquidity,
  },
  {
    path: swapRoutesConfigs.LIQUIDITY_ADD,
    getElement: () => <AddLiquidity />,
    getTitle: () => StaticTitlesAndDescriptions.Liquidity,
  },
  {
    path: swapRoutesConfigs.LIQUIDITY_DECREASE,
    getElement: () => <DecreaseLiquidity />,
    getTitle: () => StaticTitlesAndDescriptions.Liquidity,
  },
  {
    path: swapRoutesConfigs.LIQUIDITY_INCREASE,
    getElement: () => <IncreaseLiquidity />,
    getTitle: () => StaticTitlesAndDescriptions.Liquidity,
  },
  {
    path: swapRoutesConfigs.LIQUIDITY_POSITION,
    getElement: () => <Position />,
    getTitle: () => StaticTitlesAndDescriptions.Liquidity,
  },
];
