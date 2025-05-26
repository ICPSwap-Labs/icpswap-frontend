import { lazy } from "react";
import Loadable from "components/Loading/Loadable";

const Farms = Loadable(lazy(() => import("../views/staking-farm/index")));
const Farm = Loadable(lazy(() => import("../views/staking-farm/farm")));
const CreateFarm = Loadable(lazy(() => import("../views/staking-farm/create")));

export const farmRoutesConfig = {
  FARM: "/farm",
  FARM_DETAILS: "/farm/details/:id",
  FARM_CREATE: "/farm/create",
};

export const farmRoutes = [
  { path: farmRoutesConfig.FARM, getElement: () => <Farms /> },
  { path: farmRoutesConfig.FARM_DETAILS, getElement: () => <Farm /> },
  { path: farmRoutesConfig.FARM_CREATE, getElement: () => <CreateFarm /> },
];
