import { lazy } from "react";
import Loadable from "components/Loading/Loadable";
import i18n from "i18n";
import { RouteDefinition } from "./type";

const Staking = Loadable(lazy(() => import("../views/staking-token")));
const StakingDetails = Loadable(lazy(() => import("../views/staking-token/details")));
const StakingTokenCreate = Loadable(lazy(() => import("../views/staking-token/create")));

const StaticTitlesAndDescriptions = {
  Stake: i18n.t("title.stake"),
};

export const stakeRoutesConfig = {
  STAKE: "/stake",
  STAKE_DETAILS: "/stake/details/:id",
  STAKE_CREATE: "/stake/create",
};

export const stakeRoutes: RouteDefinition[] = [
  { path: stakeRoutesConfig.STAKE, getElement: () => <Staking />, getTitle: () => StaticTitlesAndDescriptions.Stake },
  {
    path: stakeRoutesConfig.STAKE_DETAILS,
    getElement: () => <StakingDetails />,
    getTitle: () => StaticTitlesAndDescriptions.Stake,
  },
  {
    path: stakeRoutesConfig.STAKE_CREATE,
    getElement: () => <StakingTokenCreate />,
    getTitle: () => StaticTitlesAndDescriptions.Stake,
  },
];
