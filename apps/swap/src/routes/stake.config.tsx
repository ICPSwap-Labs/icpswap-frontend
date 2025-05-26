import { lazy } from "react";
import Loadable from "components/Loading/Loadable";

const Staking = Loadable(lazy(() => import("../views/staking-token")));
const StakingDetails = Loadable(lazy(() => import("../views/staking-token/details")));
const StakingTokenCreate = Loadable(lazy(() => import("../views/staking-token/create")));

export const stakeRoutesConfig = {
  STAKE: "/stake",
  STAKE_DETAILS: "/stake/details/:id",
  STAKE_CREATE: "/stake/create",
};

export const stakeRoutes = [
  { path: stakeRoutesConfig.STAKE, getElement: () => <Staking /> },
  { path: stakeRoutesConfig.STAKE_DETAILS, getElement: () => <StakingDetails /> },
  { path: stakeRoutesConfig.STAKE_CREATE, getElement: () => <StakingTokenCreate /> },
];
