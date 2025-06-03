import { lazy } from "react";
import Loadable from "components/Loading/Loadable";
import i18n from "i18n";
import { RouteDefinition } from "./type";

const Farms = Loadable(lazy(() => import("../views/staking-farm/index")));
const Farm = Loadable(lazy(() => import("../views/staking-farm/farm")));
const CreateFarm = Loadable(lazy(() => import("../views/staking-farm/create")));

const StaticTitlesAndDescriptions = {
  Farm: i18n.t("title.farm"),
};

export const farmRoutesConfig = {
  FARM: "/farm",
  FARM_DETAILS: "/farm/details/:id",
  FARM_CREATE: "/farm/create",
};

export const farmRoutes: RouteDefinition[] = [
  { path: farmRoutesConfig.FARM, getElement: () => <Farms />, getTitle: () => StaticTitlesAndDescriptions.Farm },
  { path: farmRoutesConfig.FARM_DETAILS, getElement: () => <Farm />, getTitle: () => StaticTitlesAndDescriptions.Farm },
  {
    path: farmRoutesConfig.FARM_CREATE,
    getElement: () => <CreateFarm />,
    getTitle: () => StaticTitlesAndDescriptions.Farm,
  },
];
