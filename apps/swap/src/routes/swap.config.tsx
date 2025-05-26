import { lazy } from "react";
import Loadable from "components/Loading/Loadable";
import i18n from "i18n";

import { RouteDefinition } from "./type";

const Swap = Loadable(lazy(() => import("../views/swap-liquidity-v3/index")));
const SwapLimit = Loadable(lazy(() => import("../views/swap-liquidity-v3/limit")));
const SwapTransaction = Loadable(lazy(() => import("../views/swap-liquidity-v3/transaction")));
const SwapPro = Loadable(lazy(() => import("../views/swap-pro")));
const Liquidity = Loadable(lazy(() => import("../views/swap-liquidity-v3/liquidity/index")));
const AddLiquidity = Loadable(lazy(() => import("../views/swap-liquidity-v3/liquidity/AddLiquidity")));
const IncreaseLiquidity = Loadable(lazy(() => import("../views/swap-liquidity-v3/liquidity/IncreaseLiquidity")));
const DecreaseLiquidity = Loadable(lazy(() => import("../views/swap-liquidity-v3/liquidity/DecreaseLiquidity")));
const SwapReclaim = Loadable(lazy(() => import("../views/swap-liquidity-v3/reclaim/Reclaim")));
const SwapFindMisTransferToken = Loadable(lazy(() => import("../views/swap-liquidity-v3/MisTransferTokens")));
const SwapRevokeApprove = Loadable(lazy(() => import("../views/swap-liquidity-v3/RevokeApprove")));
const PCMReclaim = Loadable(lazy(() => import("../views/swap-liquidity-v3/PCMReclaim")));
const Position = Loadable(lazy(() => import("../views/swap-liquidity-v3/liquidity/Position")));
const Wrap = Loadable(lazy(() => import("../views/swap-v2/wrap/index")));

export const swapRoutesConfigs = {
  SWAP: "/swap",
  LIMIT: "/swap/limit",
  SWAP_TRANSACTIONS: "/swap/transaction",
  SWAP_RECLAIM: "/swap/withdraw",
  SWAP_REVOKE: "/swap/revoke-approve",
  SWAP_PRO: "/swap/pro",
  SWAP_WRAP: "/swap/v2/wrap",
  SWAP_PCM_RECLAIM: "/swap/pcm/reclaim",
  SWAP_MIS_TRANSFER: "/swap/find-mis-transferred-token",

  LIQUIDITY: "/liquidity",
  LIQUIDITY_ADD: "/liquidity/add/:currencyIdA?/:currencyIdB?/:feeAmount?",
  LIQUIDITY_DECREASE: "/liquidity/decrease/:positionId/:pool",
  LIQUIDITY_INCREASE: "/liquidity/increase/:positionId/:pool",
  LIQUIDITY_POSITION: "/liquidity/position/:positionId/:pool",
};

export const swapRoutes: RouteDefinition[] = [
  { path: "/", getElement: () => <Swap />, getTitle: () => i18n.t("title.swap") },
  { path: swapRoutesConfigs.SWAP, getElement: () => <Swap />, getTitle: () => i18n.t("title.swap") },
  { path: swapRoutesConfigs.LIMIT, getElement: () => <SwapLimit />, getTitle: () => i18n.t("title.limit") },
  { path: swapRoutesConfigs.SWAP_TRANSACTIONS, getElement: () => <SwapTransaction /> },
  { path: swapRoutesConfigs.SWAP_RECLAIM, getElement: () => <SwapReclaim /> },
  { path: swapRoutesConfigs.SWAP_MIS_TRANSFER, getElement: () => <SwapFindMisTransferToken /> },
  { path: swapRoutesConfigs.SWAP_REVOKE, getElement: () => <SwapRevokeApprove /> },
  { path: swapRoutesConfigs.SWAP_PCM_RECLAIM, getElement: () => <PCMReclaim /> },
  { path: swapRoutesConfigs.SWAP_PRO, getElement: () => <SwapPro />, getTitle: () => i18n.t("title.swap.pro") },
  { path: swapRoutesConfigs.SWAP_WRAP, getElement: () => <Wrap /> },
  { path: swapRoutesConfigs.LIQUIDITY, getElement: () => <Liquidity />, getTitle: () => i18n.t("title.liquidity") },
  { path: swapRoutesConfigs.LIQUIDITY_ADD, getElement: () => <AddLiquidity /> },
  { path: swapRoutesConfigs.LIQUIDITY_DECREASE, getElement: () => <DecreaseLiquidity /> },
  { path: swapRoutesConfigs.LIQUIDITY_INCREASE, getElement: () => <IncreaseLiquidity /> },
  { path: swapRoutesConfigs.LIQUIDITY_POSITION, getElement: () => <Position /> },
];
