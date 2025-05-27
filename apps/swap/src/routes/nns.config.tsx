import { lazy } from "react";
import Loadable from "components/Loading/Loadable";
import i18n from "i18n";
import { RouteDefinition } from "./type";

const SNSLaunches = Loadable(lazy(() => import("../views/sns/Launchpad/Launches")));
const SNSLaunch = Loadable(lazy(() => import("../views/sns/Launchpad/Launch")));
const SnsNeurons = Loadable(lazy(() => import("../views/sns/Neurons/index")));
const SnsVotes = Loadable(lazy(() => import("../views/sns/Voting/index")));
const SnsVoting = Loadable(lazy(() => import("../views/sns/Voting/Voting")));

const StaticTitlesAndDescriptions = {
  Nns: i18n.t("title.sns"),
};

export const nnsRoutesConfig = {
  NNS_NEURONS: "/sns/neurons",
  NNS_VOTING: "/sns/voting",
  NNS_LAUNCHES: "/sns/launches",
  NNS_VOTING_PROPOSAL: "/sns/voting/:governance_id/:proposal_id",
  NNS_LAUNCH: "/sns/launch/:root_id",
};

export const nnsRoutes: RouteDefinition[] = [
  {
    path: nnsRoutesConfig.NNS_NEURONS,
    getElement: () => <SnsNeurons />,
    getTitle: () => StaticTitlesAndDescriptions.Nns,
  },
  { path: nnsRoutesConfig.NNS_VOTING, getElement: () => <SnsVotes />, getTitle: () => StaticTitlesAndDescriptions.Nns },
  {
    path: nnsRoutesConfig.NNS_VOTING_PROPOSAL,
    getElement: () => <SnsVoting />,
    getTitle: () => StaticTitlesAndDescriptions.Nns,
  },
  {
    path: nnsRoutesConfig.NNS_LAUNCHES,
    getElement: () => <SNSLaunches />,
    getTitle: () => StaticTitlesAndDescriptions.Nns,
  },
  {
    path: nnsRoutesConfig.NNS_LAUNCH,
    getElement: () => <SNSLaunch />,
    getTitle: () => StaticTitlesAndDescriptions.Nns,
  },
];
